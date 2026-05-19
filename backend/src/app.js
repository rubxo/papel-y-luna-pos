const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const requestLogger = require("./middlewares/request-logger.middleware");
const sanitizeIds = require("./middlewares/sanitize-ids.middleware");

function createApp() {
  const app = express();

  // Render (y la mayoría de PaaS) ponen un proxy delante — necesario para rate-limit e IPs reales
  app.set("trust proxy", 1);

  app.use(helmet({ contentSecurityPolicy: false }));
  const allowedOrigins = env.nodeEnv === "development"
    ? true
    : (env.frontendUrl || "*").split(",").map(o => o.trim());

  app.use(cors({
    origin: allowedOrigins === true ? true : (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para origen: ${origin}`));
      }
    },
    credentials: true
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (env.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  // Pre-processing: log every request to the database
  app.use(requestLogger);

  // Post-processing: remove internal _id fields from API JSON responses
  app.use("/api", sanitizeIds);

  app.use("/api/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 80,
    standardHeaders: true,
    legacyHeaders: false
  }));

  app.use("/api", routes);

  const frontendRoot = path.resolve(__dirname, "..", "..");
  app.use(express.static(frontendRoot));
  app.get("/", (_req, res) => {
    res.sendFile(path.join(frontendRoot, "index.html"));
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
