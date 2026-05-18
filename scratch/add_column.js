const path = require("path");
const sequelize = require(path.join(__dirname, "../backend/src/config/database"));

async function addColumn() {
  try {
    await sequelize.authenticate();
    console.log("Adding permissions column...");
    await sequelize.query("ALTER TABLE users ADD COLUMN permissions TEXT DEFAULT '[]'");
    console.log("Column added successfully!");
    process.exit(0);
  } catch (error) {
    if (error.message.includes("duplicate column name")) {
      console.log("Column already exists.");
      process.exit(0);
    }
    console.error("Failed to add column:", error);
    process.exit(1);
  }
}

addColumn();
