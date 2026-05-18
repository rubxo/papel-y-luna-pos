const { Purchase } = require("../models");
const { createPurchase } = require("../services/purchase.service");

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

module.exports = { listPurchases, create };
