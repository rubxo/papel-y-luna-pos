const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User, Role } = require("../models");

async function authRequired(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      const error = new Error("Sesión requerida");
      error.status = 401;
      throw error;
    }

    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findByPk(payload.sub, {
      include: [{ model: Role, as: "role" }]
    });

    if (!user || !user.active) {
      const error = new Error("Usuario inactivo o no encontrado");
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    const roleName = req.user?.role?.name;
    if (!roles.includes(roleName)) {
      const error = new Error("No tienes permiso para realizar esta acción");
      error.status = 403;
      return next(error);
    }
    next();
  };
}

module.exports = { authRequired, requireRole };
