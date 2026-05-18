const env = require("../config/env");

function notFound(req, _res, next) {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const isOperational = status < 500; // 4xx son errores esperados, seguros de exponer
  const isDatabaseOffline = /ECONNREFUSED|SequelizeConnectionRefusedError/i.test(
    error.message || error.name || ""
  );

  let message;
  if (isDatabaseOffline) {
    message = "La base de datos no está disponible en este momento.";
  } else if (isOperational) {
    message = error.message || "Error en la solicitud";
  } else {
    // Error 500 interno — en producción no exponer detalles
    if (env.nodeEnv !== "production") {
      message = error.message || "Error interno del servidor";
    } else {
      message = "Error interno del servidor";
    }
  }

  res.status(status).json({
    success: false,
    message,
    details: isOperational ? (error.details || undefined) : undefined
  });
}

module.exports = { notFound, errorHandler };
