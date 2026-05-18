const { Op, fn, col, literal } = require("sequelize");
const { Sale, SaleItem, Product, Purchase, PurchaseItem, Customer, MissingRequest } = require("../models");

function parseDateRange(desde, hasta) {
  const where = {};
  if (desde || hasta) {
    where.createdAt = {};
    if (desde) where.createdAt[Op.gte] = new Date(desde);
    if (hasta) {
      const end = new Date(hasta);
      end.setHours(23, 59, 59, 999);
      where.createdAt[Op.lte] = end;
    }
  }
  return where;
}

async function dashboard(_req, res, next) {
  try {
    const [sales, products, purchases] = await Promise.all([
      Sale.findAll({ where: { status: { [Op.ne]: "anulada" } } }),
      Product.findAll({ where: { active: true } }),
      Purchase.findAll()
    ]);

    const totalSales = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    const inventoryValue = products.reduce((sum, p) => sum + Number(p.stock || 0) * Number(p.salePrice || 0), 0);

    res.json({
      success: true,
      data: {
        salesCount: sales.length,
        productsCount: products.length,
        purchasesCount: purchases.length,
        totalSales: Number(totalSales.toFixed(2)),
        inventoryValue: Number(inventoryValue.toFixed(2)),
        lowStockCount: products.filter((p) => p.trackInventory && Number(p.stock) <= 10).length
      }
    });
  } catch (error) {
    next(error);
  }
}

async function salesReport(req, res, next) {
  try {
    const { desde, hasta, paymentMethod, customerId } = req.query;
    const where = { status: { [Op.ne]: "anulada" }, ...parseDateRange(desde, hasta) };
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (customerId) where.customerId = customerId;

    const sales = await Sale.findAll({
      where,
      include: [
        { model: SaleItem, as: "items" },
        { model: Customer, as: "customer", attributes: ["id", "name"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    const totalVentas = sales.reduce((s, v) => s + Number(v.total || 0), 0);
    const totalDescuentos = sales.reduce((s, v) => s + Number(v.discountTotal || 0), 0);
    const totalImpuestos = sales.reduce((s, v) => s + Number(v.taxTotal || 0), 0);
    const totalItems = sales.reduce((s, v) => s + v.items.reduce((si, i) => si + Number(i.quantity || 0), 0), 0);

    const byPaymentMethod = {};
    for (const sale of sales) {
      const method = sale.paymentMethod;
      if (!byPaymentMethod[method]) byPaymentMethod[method] = { count: 0, total: 0 };
      byPaymentMethod[method].count++;
      byPaymentMethod[method].total += Number(sale.total || 0);
    }

    res.json({
      success: true,
      data: {
        ventas: sales,
        resumen: {
          totalVentas: Number(totalVentas.toFixed(2)),
          totalDescuentos: Number(totalDescuentos.toFixed(2)),
          totalImpuestos: Number(totalImpuestos.toFixed(2)),
          totalItems,
          cantidadVentas: sales.length,
          ticketPromedio: sales.length > 0 ? Number((totalVentas / sales.length).toFixed(2)) : 0
        },
        porMetodoPago: byPaymentMethod
      }
    });
  } catch (error) {
    next(error);
  }
}

async function topProducts(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const saleWhere = { status: { [Op.ne]: "anulada" }, ...parseDateRange(desde, hasta) };

    const sales = await Sale.findAll({
      where: saleWhere,
      include: [{ model: SaleItem, as: "items" }]
    });

    const productMap = {};
    for (const sale of sales) {
      for (const item of sale.items) {
        const key = item.productId;
        if (!productMap[key]) {
          productMap[key] = { productId: key, productName: item.productName, totalQuantity: 0, totalRevenue: 0, salesCount: 0 };
        }
        productMap[key].totalQuantity += Number(item.quantity);
        productMap[key].totalRevenue += Number(item.subtotal);
        productMap[key].salesCount++;
      }
    }

    const ranked = Object.values(productMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 20)
      .map((p) => ({ ...p, totalRevenue: Number(p.totalRevenue.toFixed(2)) }));

    res.json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
}

async function inventoryReport(_req, res, next) {
  try {
    const products = await Product.findAll({ where: { active: true }, include: ["category"] });

    const inventoryValue = products.reduce((s, p) => s + Number(p.stock || 0) * Number(p.salePrice || 0), 0);
    const costValue = products.reduce((s, p) => s + Number(p.stock || 0) * Number(p.costPrice || 0), 0);
    const lowStock = products.filter((p) => p.trackInventory && Number(p.stock) <= 10);
    const zeroStock = products.filter((p) => p.trackInventory && Number(p.stock) === 0);

    res.json({
      success: true,
      data: {
        productos: products,
        resumen: {
          totalProductos: products.length,
          valorInventario: Number(inventoryValue.toFixed(2)),
          costoInventario: Number(costValue.toFixed(2)),
          gananciaEstimada: Number((inventoryValue - costValue).toFixed(2)),
          productosStockBajo: lowStock.length,
          productosAgotados: zeroStock.length
        },
        stockBajo: lowStock,
        agotados: zeroStock
      }
    });
  } catch (error) {
    next(error);
  }
}

async function purchasesReport(req, res, next) {
  try {
    const { desde, hasta, supplierId } = req.query;
    const where = { ...parseDateRange(desde, hasta) };
    if (supplierId) where.supplierId = supplierId;

    const purchases = await Purchase.findAll({
      where,
      include: [
        { model: PurchaseItem, as: "items" },
        { association: "supplier", attributes: ["id", "name"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    const totalCompras = purchases.reduce((s, c) => s + Number(c.total || 0), 0);
    const totalItems = purchases.reduce((s, c) => s + c.items.reduce((si, i) => si + Number(i.quantity || 0), 0), 0);

    res.json({
      success: true,
      data: {
        compras: purchases,
        resumen: {
          totalCompras: Number(totalCompras.toFixed(2)),
          totalItems,
          cantidadCompras: purchases.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

async function missingReport(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const where = { ...parseDateRange(desde, hasta) };

    const items = await MissingRequest.findAll({ where, order: [["createdAt", "DESC"]] });

    const counts = {};
    for (const item of items) {
      const key = item.productName.toLowerCase().trim();
      if (!counts[key]) counts[key] = { productName: item.productName, count: 0, type: item.type, pending: 0, resolved: 0 };
      counts[key].count++;
      if (item.status === "pendiente") counts[key].pending++;
      if (item.status === "resuelto") counts[key].resolved++;
    }

    const frecuentes = Object.values(counts).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: {
        faltantes: items,
        frecuentes,
        resumen: { total: items.length, pendientes: items.filter((i) => i.status === "pendiente").length, resueltos: items.filter((i) => i.status === "resuelto").length }
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { dashboard, salesReport, topProducts, inventoryReport, purchasesReport, missingReport };
