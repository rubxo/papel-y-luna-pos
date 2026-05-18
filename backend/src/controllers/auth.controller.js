const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { signAccessToken } = require("../utils/tokens");

async function login(req, res, next) {
  try {
    const { username, password } = req.validated.body;
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: "role" }]
    });

    if (!user || !user.active) {
      const error = new Error("Usuario o contraseña incorrectos");
      error.status = 401;
      throw error;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const error = new Error("Usuario o contraseña incorrectos");
      error.status = 401;
      throw error;
    }

    user.lastLoginAt = new Date();
    await user.save();

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
    role: user.role?.name,
    roleLabel: user.role?.label,
    active: user.active,
    permissions: user.permissions
  };
}

module.exports = { login, me, logout };
