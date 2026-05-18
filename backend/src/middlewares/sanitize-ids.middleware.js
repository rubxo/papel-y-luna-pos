// Post-processing middleware: removes internal Sequelize noise from JSON responses.
// Converts Sequelize instances to plain objects and strips "_id" suffix FK fields.
function sanitizeIds(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    try {
      // Flatten Sequelize instances to plain JS objects first (eliminates circular refs)
      const plain = JSON.parse(JSON.stringify(body));
      return originalJson(deepRemoveIdFields(plain));
    } catch (_err) {
      // If serialization fails, send raw body without sanitizing
      return originalJson(body);
    }
  };

  next();
}

function deepRemoveIdFields(value) {
  if (Array.isArray(value)) {
    return value.map(deepRemoveIdFields);
  }
  if (value !== null && typeof value === "object") {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.endsWith("_id")) continue;
      cleaned[key] = deepRemoveIdFields(val);
    }
    return cleaned;
  }
  return value;
}

module.exports = sanitizeIds;
