const { Product, Category } = require("../models");
const env = require("../config/env");
const { emitEvent } = require("../sockets");

async function listProducts(req, res, next) {
  try {
    const { page, limit: limitStr, search, categoryId } = req.query;
    const where = {};
    if (search) {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (categoryId) where.categoryId = categoryId;

    // Si no se envía page, devuelve todo (backward-compatible con el frontend actual)
    if (!page) {
      const products = await Product.findAll({
        where,
        include: [{ model: Category, as: "category" }],
        order: [["name", "ASC"]]
      });
      return res.json({ success: true, data: products });
    }

    const limit = Math.min(parseInt(limitStr) || 50, 200);
    const offset = (Math.max(parseInt(page), 1) - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: "category" }],
      order: [["name", "ASC"]],
      limit,
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), limit, pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    next(error);
  }
}

async function listLowStock(req, res, next) {
  try {
    const products = await Product.findAll({
      where: { active: true, trackInventory: true },
      include: [{ model: Category, as: "category" }],
      order: [["stock", "ASC"]]
    });
    res.json({
      success: true,
      data: products.filter((product) => Number(product.stock) <= env.business.lowStockThreshold)
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.validated.body);
    emitEvent("product:created", { id: product.id });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.validated.params.id);
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }

    await product.update(req.validated.body);
    emitEvent("product:updated", { id: product.id });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.validated.params.id);
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }

    await product.update({ active: false });
    emitEvent("product:deleted", { id: product.id });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, listLowStock, createProduct, updateProduct, deleteProduct };
