const { sequelize, Product, Purchase, PurchaseItem } = require("../models");
const { roundMoney } = require("../utils/money");
const { moveStock } = require("./inventory.service");
const { logAction } = require("./audit.service");
const { emitEvent } = require("../sockets");

async function createPurchase(payload, user) {
  return sequelize.transaction(async (transaction) => {
    let total = 0;
    const normalizedItems = [];

    for (const item of payload.items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!product) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        throw error;
      }

      const quantity = Number(item.quantity);
      const unitCost = roundMoney(item.unitCost);
      const subtotal = roundMoney(quantity * unitCost);
      total += subtotal;
      normalizedItems.push({ product, quantity, unitCost, subtotal });
    }

    const purchase = await Purchase.create({
      supplierId: payload.supplierId || null,
      userId: user.id,
      purchaseNumber: `CMP-${Date.now()}`,
      paymentMethod: payload.paymentMethod,
      total: roundMoney(total),
      notes: payload.notes || null
    }, { transaction });

    for (const item of normalizedItems) {
      await PurchaseItem.create({
        purchaseId: purchase.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal: item.subtotal
      }, { transaction });

      item.product.costPrice = item.unitCost;
      await moveStock({
        product: item.product,
        quantity: item.quantity,
        type: "compra",
        userId: user.id,
        referenceType: "purchase",
        referenceId: purchase.id,
        notes: `Compra ${purchase.purchaseNumber}`,
        transaction
      });
    }

    await logAction({
      userId: user.id,
      action: "CREATE",
      entity: "purchase",
      entityId: purchase.id,
      details: { purchaseNumber: purchase.purchaseNumber, total: purchase.total },
      transaction
    });

    emitEvent("purchase:created", { id: purchase.id, purchaseNumber: purchase.purchaseNumber });
    emitEvent("inventory:changed", { reason: "purchase", purchaseId: purchase.id });

    return Purchase.findByPk(purchase.id, { include: ["items", "supplier"], transaction });
  });
}

module.exports = { createPurchase };
