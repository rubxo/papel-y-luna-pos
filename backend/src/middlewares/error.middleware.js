function notFound(req, _res, next) {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const isDatabaseOffline = /ECONNREFUSED|SequelizeConnectionRefusedError/i.test(error.message || error.name || "");

  res.status(status).json({
    success: false,
    message: isDatabaseOffline
      ? "La base de datos no está disponible. Usa el modo local de prueba o inicia MySQL."
      : error.message || "Error interno del servidor",
    details: error.details || undefined
  });
}

module.exports = { notFound, errorHandler };
