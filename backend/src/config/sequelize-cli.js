require("dotenv").config();
const path = require("path");

const useMySQL = process.env.DB_HOST && process.env.DB_HOST !== "127.0.0.1";

const mysqlConfig = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "papel_luna_pos",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  migrationStorageTableName: "sequelize_meta",
  seederStorage: "sequelize",
  seederStorageTableName: "sequelize_data"
};

const sqliteConfig = {
  dialect: "sqlite",
  storage: path.join(__dirname, "../../papel_luna_pos.sqlite"),
  migrationStorageTableName: "sequelize_meta",
  seederStorage: "sequelize",
  seederStorageTableName: "sequelize_data"
};

const config = useMySQL ? mysqlConfig : sqliteConfig;

module.exports = {
  development: config,
  test: {
    ...sqliteConfig,
    storage: ":memory:",
    logging: false
  },
  production: mysqlConfig
};
