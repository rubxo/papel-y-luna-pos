const { Setting } = require("../models");
const { logAction } = require("../services/audit.service");

async function list(_req, res, next) {
  try {
    const rows = await Setting.findAll({ order: [["key", "ASC"]] });
    // Devuelve como objeto { key: { value, label } } para fácil acceso en el frontend
    const settings = {};
    rows.forEach(r => { settings[r.key] = { value: r.value, label: r.label }; });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined || value === null) {
      const error = new Error("El campo 'value' es requerido");
      error.status = 400;
      throw error;
    }

    const [setting, created] = await Setting.findOrCreate({
      where: { key },
      defaults: { value: String(value), label: key }
    });

    if (!created) await setting.update({ value: String(value) });

    await logAction({
      userId: req.user.id,
      action: "UPDATE_SETTING",
      entity: "setting",
      entityId: null,
      details: { key, value }
    }).catch(() => {});

    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, update };
