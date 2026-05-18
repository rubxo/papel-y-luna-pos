const { MissingRequest, User } = require("../models");
const { Op } = require("sequelize");

async function list(req, res, next) {
  try {
    const { status, type, desde, hasta } = req.query;
    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt[Op.gte] = new Date(desde);
      if (hasta) {
        const end = new Date(hasta);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    const items = await MissingRequest.findAll({
      where,
      include: [{ model: User, as: "user", attributes: ["id", "fullName", "username"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { productName, type, quantity, notes, suggestedSupplier } = req.body;

    if (!productName || !productName.trim()) {
      const err = new Error("El nombre del producto es requerido");
      err.status = 400;
      throw err;
    }

    const item = await MissingRequest.create({
      userId: req.user.id,
      productName: productName.trim(),
      type: type || "agotado",
      status: "pendiente",
      quantity: quantity ? Number(quantity) : null,
      notes: notes || null,
      suggestedSupplier: suggestedSupplier || null
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const item = await MissingRequest.findByPk(req.params.id);
    if (!item) {
      const err = new Error("Faltante no encontrado");
      err.status = 404;
      throw err;
    }

    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (status === "resuelto" && item.status !== "resuelto") {
      updateData.resolvedAt = new Date();
    }

    await item.update(updateData);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const item = await MissingRequest.findByPk(req.params.id);
    if (!item) {
      const err = new Error("Faltante no encontrado");
      err.status = 404;
      throw err;
    }
    await item.destroy();
    res.json({ success: true, message: "Faltante eliminado" });
  } catch (error) {
    next(error);
  }
}

async function frequent(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const where = { status: "pendiente" };

    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt[Op.gte] = new Date(desde);
      if (hasta) {
        const end = new Date(hasta);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    const items = await MissingRequest.findAll({ where, order: [["createdAt", "DESC"]] });

    const counts = {};
    for (const item of items) {
      const key = item.productName.toLowerCase().trim();
      if (!counts[key]) counts[key] = { productName: item.productName, count: 0, type: item.type };
      counts[key].count++;
    }

    const frequent = Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    res.json({ success: true, data: frequent });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, updateStatus, remove, frequent };
