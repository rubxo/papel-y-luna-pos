const path = require("path");
const { User, Role } = require(path.join(__dirname, "../backend/src/models"));
const sequelize = require(path.join(__dirname, "../backend/src/config/database"));

async function checkUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ include: [{ model: Role, as: "role" }] });
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkUsers();
