const path = require("path");
const sequelize = require(path.join(__dirname, "../backend/src/config/database"));
const { User, Role } = require(path.join(__dirname, "../backend/src/models"));

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log("Syncing database...");
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Sync failed:", error);
    process.exit(1);
  }
}

syncDb();
