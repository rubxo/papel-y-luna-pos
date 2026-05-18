const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.ENUM("admin", "cajero"),
    allowNull: false,
    unique: true
  },
  label: {
    type: DataTypes.STRING(80),
    allowNull: false
  }
}, {
  tableName: "roles"
});

module.exports = Role;
