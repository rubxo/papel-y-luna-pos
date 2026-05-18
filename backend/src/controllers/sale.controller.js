const { Sale, SaleItem, Customer, User, Refund, SaleCorrection } = require("../models");
const { createSale, refundSale, correctSale, cancelSale } = require("../services/sale.service");
const { logAction } = require("../services/audit.service");
const { emitEvent } = require("../sockets");

async function listSales(_req, res, next) {
  try {
    const sales = await Sale.findAll({
      include: ["items", "customer", "user"],
      order: [["createdAt", "DESC"]]
    });
    res.json({ success: true, data: sales });
  } catch (error) {
    next(error);
  }
}

async function getSale(req, res, next) {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: SaleItem, as: "items" },
        { model: Customer, as: "customer" },
        { model: User, as: "user" },
        { model: Refund, as: "refunds", include: ["items"] },
        { model: SaleCorrection, as: "corrections" }
      ]
    });

    if (!sale) {
      const error = new Error("Venta no encontrada");
      error.status = 404;
      throw error;
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const sale = await createSale(req.validated.body, req.user);
    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

async function refund(req, res, next) {
  try {
    const refundData = await refundSale(req.validated.params.id, req.validated.body, req.user);
    res.status(201).json({ success: true, data: refundData });
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const sale = await cancelSale(req.params.id, req.body.reason, req.user);
    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

async function correct(req, res, next) {
  try {
    const sale = await correctSale(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) {
      const error = new Error("Venta no encontrada");
      error.status = 404;
      throw error;
    }

    const { status, notes, total, subtotal, taxTotal } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (total !== undefined) updateData.total = total;
    if (subtotal !== undefined) updateData.subtotal = subtotal;
    if (taxTotal !== undefined) updateData.taxTotal = taxTotal;

    await sale.update(updateData);
    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

module.exports = { listSales, getSale, create, refund, cancel, correct, update };
