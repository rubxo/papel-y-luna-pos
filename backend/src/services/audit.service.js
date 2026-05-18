const { AuditLog } = require("../models");

async function logAction({ userId = null, action, entity, entityId = null, details = null, transaction = null }) {
  return AuditLog.create({ userId, action, entity, entityId, details }, { transaction });
}

module.exports = { logAction };
