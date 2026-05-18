const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { signAccessToken } = require("../utils/tokens");
const { logAction } = require("../services/audit.service");

async function login(req, res, next) {
  try {
    const { username, password } = req.validated.body;
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: "role" }]
    });

    // Usuario no existe o inactivo — misma respuesta genérica para no filtrar info
    if (!user || !user.active) {
      await logAction({
        userId: null,
        action: "LOGIN_FAILED",
        entity: "auth",
        entityId: null,
        details: { username, reason: user ? "inactive" : "not_found", ip: req.ip }
      }).catch(() => {});
      const error = new Error("Usuario o contraseña incorrectos");
      error.status = 401;
      throw error;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await logAction({
        userId: user.id,
        action: "LOGIN_FAILED",
        entity: "auth",
        entityId: user.id,
        details: { username, reason: "wrong_password", ip: req.ip }
      }).catch(() => {});
      const error = new Error("Usuario o contraseña incorrectos");
      error.status = 401;
      throw error;
    }

    user.lastLoginAt = new Date();
    await user.save();

    await logAction({
      userId: user.id,
      action: "LOGIN",
      entity: "auth",
      entityId: user.id,
      details: { username, ip: req.ip }
    }).catch(() => {});

    res.json({
      success: true,
      token: signAccessToken(user),
      user: serializeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

function me(req, res) {
  res.json({ success: true, user: serializeUser(req.user) });
}

function logout(_req, res) {
  res.json({ success: true, message: "Sesión cerrada" });
}

function serializeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email || null,
    role: user.role?.name,
    roleLabel: user.role?.label,
    active: user.active,
    permissions: user.permissions
  };
}

module.exports = { login, me, logout };
