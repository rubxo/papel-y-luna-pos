const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");

function serialize(user) {
  return {
    id: user.id,
    roleId: user.roleId,
    fullName: user.fullName,
    username: user.username,
    active: user.active,
    role: user.role || undefined,
    permissions: user.permissions,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function resolveRoleId({ roleId, roleName, rol }) {
  if (roleId) return roleId;
  const name = roleName || rol;
  if (!name) return null;

  const role = await Role.findOne({ where: { name } });
  return role ? role.id : null;
}

async function list(_req, res, next) {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: "role" }],
      order: [["fullName", "ASC"]]
    });
    res.json({ success: true, data: users.map(serialize) });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { fullName, username, password, roleId, active = true, roleName, rol, permissions } = req.body;
    const finalRoleId = await resolveRoleId({ roleId, roleName, rol });

    if (!fullName || !username || !password || !finalRoleId) {
      const error = new Error("Nombre, usuario, contraseña y rol son obligatorios");
      error.status = 400;
      throw error;
    }

    const user = await User.create({
      fullName,
      username,
      roleId: finalRoleId,
      active,
      permissions,
      passwordHash: await bcrypt.hash(password, 10)
    });
    res.status(201).json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    const allowed = {};
    ["fullName", "username", "active", "permissions"].forEach((key) => {
      if (req.body[key] !== undefined) allowed[key] = req.body[key];
    });
    if (req.body.roleId !== undefined || req.body.roleName !== undefined || req.body.rol !== undefined) {
      const finalRoleId = await resolveRoleId(req.body);
      if (!finalRoleId) {
        const error = new Error("Rol no encontrado");
        error.status = 400;
        throw error;
      }
      allowed.roleId = finalRoleId;
    }

    await user.update(allowed);
    res.json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }
    if (!req.body.password || req.body.password.length < 6) {
      const error = new Error("La contraseña debe tener al menos 6 caracteres");
      error.status = 400;
      throw error;
    }
    await user.update({ passwordHash: await bcrypt.hash(req.body.password, 10) });
    res.json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }
    await user.destroy();
    res.json({ success: true, message: "Usuario eliminado permanentemente" });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, update, changePassword, remove };
