const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { logAction } = require("../services/audit.service");

const PASSWORD_MIN_LENGTH = 8;

function parsePermissions(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try { return JSON.parse(raw); } catch (_e) { return []; }
}

function serialize(user) {
  return {
    id: user.id,
    roleId: user.roleId,
    fullName: user.fullName,
    username: user.username,
    email: user.email || null,
    active: user.active,
    role: user.role ? { id: user.role.id, name: user.role.name, label: user.role.label } : undefined,
    permissions: parsePermissions(user.permissions),
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function resolveRoleId({ roleId, roleName, rol }) {
  if (roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) { const e = new Error("Rol no encontrado"); e.status = 400; throw e; }
    return roleId;
  }
  const name = roleName || rol;
  if (!name) return null;
  const role = await Role.findOne({ where: { name } });
  if (!role) { const e = new Error(`Rol '${name}' no existe`); e.status = 400; throw e; }
  return role.id;
}

// GET /api/users
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

// GET /api/users/:id
async function getById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, as: "role" }]
    });
    if (!user) { const e = new Error("Usuario no encontrado"); e.status = 404; throw e; }
    res.json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
}

// POST /api/users
async function create(req, res, next) {
  try {
    const { fullName, username, email, password, roleId, roleName, rol, active = true, permissions } = req.body;
    const finalRoleId = await resolveRoleId({ roleId, roleName, rol });

    if (!fullName?.trim() || !username?.trim() || !password || !finalRoleId) {
      const e = new Error("Nombre, usuario, contraseña y rol son obligatorios"); e.status = 400; throw e;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      const e = new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`); e.status = 400; throw e;
    }

    const existing = await User.findOne({ where: { username: username.trim() } });
    if (existing) { const e = new Error("El nombre de usuario ya está en uso"); e.status = 409; throw e; }

    const user = await User.create({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email?.trim() || null,
      roleId: finalRoleId,
      active,
      permissions: Array.isArray(permissions) ? JSON.stringify(permissions) : (permissions || "[]"),
      passwordHash: await bcrypt.hash(password, 10)
    });

    const userWithRole = await User.findByPk(user.id, { include: [{ model: Role, as: "role" }] });

    await logAction({
      userId: req.user.id,
      action: "CREATE",
      entity: "user",
      entityId: user.id,
      details: { username: user.username, role: finalRoleId }
    });

    res.status(201).json({ success: true, data: serialize(userWithRole) });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/:id
async function update(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, { include: [{ model: Role, as: "role" }] });
    if (!user) { const e = new Error("Usuario no encontrado"); e.status = 404; throw e; }

    const allowed = {};
    if (req.body.fullName !== undefined) allowed.fullName = req.body.fullName.trim();
    if (req.body.username !== undefined) {
      const taken = await User.findOne({ where: { username: req.body.username.trim() } });
      if (taken && taken.id !== user.id) { const e = new Error("El nombre de usuario ya está en uso"); e.status = 409; throw e; }
      allowed.username = req.body.username.trim();
    }
    if (req.body.email !== undefined) allowed.email = req.body.email?.trim() || null;
    if (req.body.permissions !== undefined) {
      allowed.permissions = Array.isArray(req.body.permissions)
        ? JSON.stringify(req.body.permissions)
        : (req.body.permissions || "[]");
    }
    if (req.body.roleId !== undefined || req.body.roleName !== undefined || req.body.rol !== undefined) {
      allowed.roleId = await resolveRoleId(req.body);
    }

    await user.update(allowed);
    await user.reload({ include: [{ model: Role, as: "role" }] });

    await logAction({
      userId: req.user.id,
      action: "UPDATE",
      entity: "user",
      entityId: user.id,
      details: { updated: Object.keys(allowed) }
    });

    res.json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/:id/status
async function toggleStatus(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, { include: [{ model: Role, as: "role" }] });
    if (!user) { const e = new Error("Usuario no encontrado"); e.status = 404; throw e; }

    // No puede desactivarse a sí mismo
    if (user.id === req.user.id) {
      const e = new Error("No puedes desactivar tu propia cuenta"); e.status = 400; throw e;
    }

    const newActive = req.body.active !== undefined ? Boolean(req.body.active) : !user.active;
    await user.update({ active: newActive });

    await logAction({
      userId: req.user.id,
      action: newActive ? "ACTIVATE" : "DEACTIVATE",
      entity: "user",
      entityId: user.id,
      details: { username: user.username, active: newActive }
    });

    res.json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/:id/password  (admin cambia la contraseña de otro usuario)
async function changePassword(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) { const e = new Error("Usuario no encontrado"); e.status = 404; throw e; }

    const { password } = req.body;
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      const e = new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`); e.status = 400; throw e;
    }

    await user.update({ passwordHash: await bcrypt.hash(password, 10) });

    await logAction({
      userId: req.user.id,
      action: "CHANGE_PASSWORD",
      entity: "user",
      entityId: user.id,
      details: { changedBy: "admin", targetUser: user.username }
    });

    res.json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/me/password  (usuario cambia su propia contraseña)
async function meChangePassword(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) { const e = new Error("Usuario no encontrado"); e.status = 404; throw e; }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      const e = new Error("Se requieren contraseña actual y nueva"); e.status = 400; throw e;
    }
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      const e = new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`); e.status = 400; throw e;
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) { const e = new Error("La contraseña actual es incorrecta"); e.status = 401; throw e; }

    await user.update({ passwordHash: await bcrypt.hash(newPassword, 10) });

    await logAction({
      userId: req.user.id,
      action: "CHANGE_PASSWORD",
      entity: "user",
      entityId: user.id,
      details: { changedBy: "self" }
    });

    res.json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    next(error);
  }
}

// GET /api/users/me/permissions
function mePermissions(req, res) {
  const permissions = parsePermissions(req.user.permissions);
  const roleName = req.user.role?.name;
  res.json({
    success: true,
    data: {
      role: roleName,
      permissions
    }
  });
}

// DELETE /api/users/:id  →  baja lógica (active = false)
async function remove(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) { const e = new Error("Usuario no encontrado"); e.status = 404; throw e; }
    if (user.id === req.user.id) { const e = new Error("No puedes eliminar tu propia cuenta"); e.status = 400; throw e; }

    // Baja lógica: desactivar en vez de borrar para preservar historial
    await user.update({ active: false });

    await logAction({
      userId: req.user.id,
      action: "DELETE",
      entity: "user",
      entityId: user.id,
      details: { username: user.username, softDelete: true }
    });

    res.json({ success: true, message: "Usuario desactivado permanentemente" });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, toggleStatus, changePassword, meChangePassword, mePermissions, remove };
