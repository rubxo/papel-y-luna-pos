const { AuditLog, User } = require("../models");
const { Op } = require("sequelize");

async function list(req, res, next) {
  try {
    const { page, limit: limitStr, action, entity, userId, from, to } = req.query;

    const where = {};
    if (action)   where.action = { [Op.like]: `%${action}%` };
    if (entity)   where.entity = entity;
    if (userId)   where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to)   where.createdAt[Op.lte] = new Date(to + "T23:59:59");
    }

    const limit  = Math.min(parseInt(limitStr) || 50, 200);
    const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [{ model: User, as: "user", attributes: ["id", "username", "fullName"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page) || 1, limit, pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { list };
