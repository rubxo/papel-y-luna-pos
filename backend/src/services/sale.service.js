const env = require("../config/env");
const { sequelize, Product, Sale, SaleItem, Refund, RefundItem, SaleCorrection, Customer } = require("../models");
const { roundMoney } = require("../utils/money");
const { moveStock } = require("./inventory.service");
const { logAction } = require("./audit.service");
const { emitEvent } = require("../sockets");

function calculateTotals(items, discountType, discountValue) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.subtotal, 0));
  let discountTotal = 0;

  if (discountType === "porcentaje") {
    if (Number(discountValue) < 0 || Number(discountValue) > 100) {
      const error = new Error("El descuento porcentual debe estar entre 0 y 100");
      error.status = 400;
      throw error;
    }
    discountTotal = roundMoney(subtotal * Number(discountValue) / 100);
  }

  if (discountType === "monto") {
    if (Number(discountValue) < 0 || Number(discountValue) > subtotal) {
      const error = new Error("El descuento fijo no puede ser negativo ni superar el subtotal");
      error.status = 400;
      throw error;
    }
    discountTotal = roundMoney(discountValue);
  }

  const taxable = roundMoney(subtotal - discountTotal);
  // Los precios de venta incluyen IVA — se extrae el componente para reportar,
  // pero el total no cambia (IVA ya está incluido en el precio).
  const taxTotal = roundMoney(taxable * env.business.ivaRate / (1 + env.business.ivaRate));
  const total = taxable;

  return { subtotal, discountTotal, taxTotal, total };
}

async function createSale(payload, user) {
  return sequelize.transaction(async (transaction) => {
    const normalizedItems = [];

    for (const item of payload.items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!product || !product.active) {
        const error = new Error("Producto no encontrado o inactivo");
        error.status = 404;
        throw error;
      }

      const quantity = Number(item.quantity);
      if (quantity <= 0) {
        const error = new Error("La cantidad debe ser mayor a cero");
        error.status = 400;
        throw error;
      }

      if (product.trackInventory && product.stock < quantity) {
        const error = new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
        error.status = 409;
        throw error;
      }

      const unitPrice = roundMoney(product.salePrice);
      normalizedItems.push({
        product,
        quantity,
        productName: product.name,
        unitPrice,
        subtotal: roundMoney(unitPrice * quantity)
      });
    }

    const totals = calculateTotals(normalizedItems, payload.discountType, Number(payload.discountValue || 0));

    if (payload.paymentMethod === "efectivo" && Number(payload.amountReceived || 0) < totals.total) {
      const error = new Error("El dinero recibido es menor que el total");
      error.status = 400;
      throw error;
    }

    const sale = await Sale.create({
      userId: user.id,
      customerId: payload.customerId || null,
      saleNumber: `VTA-${Date.now()}`,
      paymentMethod: payload.paymentMethod,
      subtotal: totals.subtotal,
      discountType: payload.discountType || null,
      discountValue: payload.discountValue || 0,
      discountTotal: totals.discountTotal,
      taxTotal: totals.taxTotal,
      total: totals.total,
      amountReceived: payload.amountReceived || null,
      changeAmount: payload.paymentMethod === "efectivo" ? roundMoney(Number(payload.amountReceived || 0) - totals.total) : 0,
      notes: payload.notes || null
    }, { transaction });

    for (const item of normalizedItems) {
      await SaleItem.create({
        saleId: sale.id,
        productId: item.product.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }, { transaction });

      if (item.product.trackInventory) {
        await moveStock({
          product: item.product,
          quantity: -item.quantity,
          type: "venta",
          userId: user.id,
          referenceType: "sale",
          referenceId: sale.id,
          notes: `Venta ${sale.saleNumber}`,
          transaction
        });
      }
    }

    await logAction({
      userId: user.id,
      action: "CREATE",
      entity: "sale",
      entityId: sale.id,
      details: { saleNumber: sale.saleNumber, total: sale.total },
      transaction
    });

    emitEvent("sale:created", { id: sale.id, saleNumber: sale.saleNumber });
    emitEvent("inventory:changed", { reason: "sale", saleId: sale.id });

    return Sale.findByPk(sale.id, { include: ["items", "customer", "user"], transaction });
  });
}

async function refundSale(saleId, payload, user) {
  return sequelize.transaction(async (transaction) => {
    const sale = await Sale.findByPk(saleId, {
      include: [{ model: SaleItem, as: "items" }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!sale || sale.status === "anulada") {
      const error = new Error("Venta no encontrada o anulada");
      error.status = 404;
      throw error;
    }

    const itemsToRefund = [];
    for (const requested of payload.items) {
      const saleItem = sale.items.find((item) => item.id === requested.saleItemId);
      if (!saleItem) {
        const error = new Error("Item de venta no encontrado");
        error.status = 404;
        throw error;
      }

      const quantity = Number(requested.quantity);
      if (quantity <= 0 || quantity > saleItem.quantity) {
        const error = new Error("Cantidad de reembolso inválida");
        error.status = 400;
        throw error;
      }

      itemsToRefund.push({
        saleItem,
        quantity,
        unitPrice: Number(saleItem.unitPrice),
        subtotal: roundMoney(Number(saleItem.unitPrice) * quantity)
      });
    }

    const total = roundMoney(itemsToRefund.reduce((sum, item) => sum + item.subtotal, 0));
    const refund = await Refund.create({
      saleId: sale.id,
      userId: user.id,
      type: payload.type || (itemsToRefund.length === sale.items.length ? "total" : "parcial"),
      reason: payload.reason,
      total,
      restock: payload.restock !== false
    }, { transaction });

    for (const item of itemsToRefund) {
      await RefundItem.create({
        refundId: refund.id,
        saleItemId: item.saleItem.id,
        productId: item.saleItem.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }, { transaction });

      if (refund.restock) {
        const product = await Product.findByPk(item.saleItem.productId, { transaction, lock: transaction.LOCK.UPDATE });
        if (product?.trackInventory) {
          await moveStock({
            product,
            quantity: item.quantity,
            type: "reembolso",
            userId: user.id,
            referenceType: "refund",
            referenceId: refund.id,
            notes: payload.reason,
            transaction
          });
        }
      }
    }

    await logAction({
      userId: user.id,
      action: "CREATE",
      entity: "refund",
      entityId: refund.id,
      details: { saleId: sale.id, total },
      transaction
    });

    emitEvent("sale:refunded", { saleId: sale.id, refundId: refund.id });
    emitEvent("inventory:changed", { reason: "refund", saleId: sale.id });

    return Refund.findByPk(refund.id, { include: ["items"], transaction });
  });
}

async function correctSale(saleId, payload, user) {
  return sequelize.transaction(async (transaction) => {
    const sale = await Sale.findByPk(saleId, {
      include: [{ model: SaleItem, as: "items" }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!sale || sale.status === "anulada") {
      const error = new Error("Venta no encontrada o anulada");
      error.status = 404;
      throw error;
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      const error = new Error("La corrección debe incluir al menos un ítem");
      error.status = 400;
      throw error;
    }

    const beforeData = {
      items: sale.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        subtotal: Number(i.subtotal)
      })),
      subtotal: Number(sale.subtotal),
      discountType: sale.discountType,
      discountValue: Number(sale.discountValue),
      discountTotal: Number(sale.discountTotal),
      taxTotal: Number(sale.taxTotal),
      total: Number(sale.total),
      paymentMethod: sale.paymentMethod,
      customerId: sale.customerId,
      notes: sale.notes
    };

    // Restore inventory for old items
    for (const oldItem of sale.items) {
      const product = await Product.findByPk(oldItem.productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (product?.trackInventory) {
        await moveStock({
          product,
          quantity: Number(oldItem.quantity),
          type: "correccion",
          userId: user.id,
          referenceType: "sale_correction",
          referenceId: sale.id,
          notes: `Corrección venta ${sale.saleNumber} - restauración`,
          transaction
        });
      }
      await oldItem.destroy({ transaction });
    }

    // Create new items
    const newItems = [];
    for (const item of payload.items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!product || !product.active) {
        const error = new Error("Producto no encontrado o inactivo");
        error.status = 404;
        throw error;
      }

      const quantity = Number(item.quantity);
      if (quantity <= 0) {
        const error = new Error("La cantidad debe ser mayor a cero");
        error.status = 400;
        throw error;
      }

      if (product.trackInventory && product.stock < quantity) {
        const error = new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
        error.status = 409;
        throw error;
      }

      const unitPrice = roundMoney(product.salePrice);
      newItems.push({ product, quantity, productName: product.name, unitPrice, subtotal: roundMoney(unitPrice * quantity) });
    }

    const totals = calculateTotals(newItems, payload.discountType, Number(payload.discountValue || 0));

    for (const item of newItems) {
      await SaleItem.create({
        saleId: sale.id,
        productId: item.product.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }, { transaction });

      if (item.product.trackInventory) {
        await moveStock({
          product: item.product,
          quantity: -item.quantity,
          type: "correccion",
          userId: user.id,
          referenceType: "sale_correction",
          referenceId: sale.id,
          notes: `Corrección venta ${sale.saleNumber} - nuevo ítem`,
          transaction
        });
      }
    }

    const afterData = {
      items: newItems.map((i) => ({ productId: i.product.id, productName: i.productName, quantity: i.quantity, unitPrice: i.unitPrice, subtotal: i.subtotal })),
      ...totals,
      paymentMethod: payload.paymentMethod || sale.paymentMethod,
      customerId: payload.customerId !== undefined ? payload.customerId : sale.customerId,
      notes: payload.notes !== undefined ? payload.notes : sale.notes
    };

    await sale.update({
      status: "corregida",
      subtotal: totals.subtotal,
      discountType: payload.discountType || null,
      discountValue: payload.discountValue || 0,
      discountTotal: totals.discountTotal,
      taxTotal: totals.taxTotal,
      total: totals.total,
      paymentMethod: payload.paymentMethod || sale.paymentMethod,
      customerId: payload.customerId !== undefined ? payload.customerId : sale.customerId,
      notes: payload.notes !== undefined ? payload.notes : sale.notes
    }, { transaction });

    await SaleCorrection.create({
      saleId: sale.id,
      userId: user.id,
      reason: payload.reason || "Corrección manual",
      beforeData,
      afterData
    }, { transaction });

    await logAction({
      userId: user.id,
      action: "CORRECT",
      entity: "sale",
      entityId: sale.id,
      details: { saleNumber: sale.saleNumber },
      transaction
    });

    emitEvent("sale:corrected", { id: sale.id, saleNumber: sale.saleNumber });
    emitEvent("inventory:changed", { reason: "correction", saleId: sale.id });

    return Sale.findByPk(sale.id, { include: ["items", "customer", "user", "corrections"], transaction });
  });
}

async function cancelSale(saleId, reason, user) {
  return sequelize.transaction(async (transaction) => {
    const sale = await Sale.findByPk(saleId, {
      include: [{ model: SaleItem, as: "items" }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!sale) {
      const error = new Error("Venta no encontrada");
      error.status = 404;
      throw error;
    }

    if (sale.status === "anulada") {
      const error = new Error("La venta ya está anulada");
      error.status = 400;
      throw error;
    }

    // Restore inventory
    for (const item of sale.items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (product?.trackInventory) {
        await moveStock({
          product,
          quantity: Number(item.quantity),
          type: "anulacion",
          userId: user.id,
          referenceType: "sale",
          referenceId: sale.id,
          notes: `Anulación venta ${sale.saleNumber}`,
          transaction
        });
      }
    }

    await sale.update({ status: "anulada" }, { transaction });

    await logAction({
      userId: user.id,
      action: "CANCEL",
      entity: "sale",
      entityId: sale.id,
      details: { reason: reason || "Anulación manual", saleNumber: sale.saleNumber },
      transaction
    });

    emitEvent("sale:cancelled", { id: sale.id });
    emitEvent("inventory:changed", { reason: "cancel", saleId: sale.id });

    return sale;
  });
}

module.exports = { createSale, refundSale, correctSale, cancelSale, calculateTotals };
