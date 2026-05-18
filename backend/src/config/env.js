const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5500",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || "papel_luna_pos",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev_secret_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  },
  business: {
    ivaRate: Number(process.env.IVA_RATE || 0.19),
    lowStockThreshold: Number(process.env.LOW_STOCK_THRESHOLD || 10)
  }
};

module.exports = env;
