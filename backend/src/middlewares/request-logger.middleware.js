const RequestLog = require("../models/request-log.model");

// Pre-processing middleware: logs each HTTP request to the database.
// Captures method, path, status code, response time, IP, and authenticated user.
function requestLogger(req, res, next) {
  const startAt = Date.now();

  res.on("finish", () => {
    const responseTimeMs = Date.now() - startAt;
    const userId = req.user ? req.user.id : null;
    const ip = req.ip || (req.connection && req.connection.remoteAddress) || null;

    RequestLog.create({
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTimeMs,
      ip,
      userId
    }).catch(() => {
      // Silently ignore DB write errors to avoid breaking the request
    });
  });

  next();
}

module.exports = requestLogger;
