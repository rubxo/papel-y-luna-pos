const { Sequelize } = require("sequelize");
const path = require("path");
const env = require("./env");

let sequelize;

// En desarrollo, usamos SQLite por defecto (sin necesidad de MySQL)
if (env.nodeEnv === "development") {
  const dbPath = path.join(__dirname, "../../papel_luna_pos.sqlite");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: false
    }
  });
  console.log(`📦 Usando SQLite en: ${dbPath}`);
} else if (env.nodeEnv === "test") {
  // Tests usan SQLite en memoria
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: false
    }
  });
} else {
  // Producción: MySQL real
  sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: false
    }
  });
  console.log(`🗄️ Conectando a MySQL: ${env.db.host}:${env.db.port}/${env.db.name}`);
}

module.exports = sequelize;
