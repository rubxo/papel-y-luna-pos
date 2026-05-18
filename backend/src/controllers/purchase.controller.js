const { Purchase, PurchaseItem } = require("../models");
const { createPurchase } = require("../services/purchase.service");
const { logAction } = require("../services/audit.service");

async function listPurchases(_req, res, next) {
  try {
    const purchases = await Purchase.findAll({
      include: ["items", "supplier", "user"],
      order: [["createdAt", "DESC"]]
    });
    res.json({ success: true, data: purchases });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const purchase = await createPurchase(req.validated.body, req.user);
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const purchase = await Purchase.findByPk(req.params.id, { include: ["items"] });
    if (!purchase) {
      const error = new Error("Compra no encontrada");
      error.status = 404;
      throw error;
    }

    await PurchaseItem.destroy({ where: { purchaseId: purchase.id } });
    await purchase.destroy();

    await logAction({
      userId: req.user.id,
      action: "DELETE",
      entity: "purchase",
      entityId: purchase.id,
      details: { purchaseNumber: purchase.purchaseNumber, total: purchase.total }
    });

    res.json({ success: true, message: "Compra eliminada" });
  } catch (error) {
    next(error);
  }
}

module.exports = { listPurchases, create, remove };
