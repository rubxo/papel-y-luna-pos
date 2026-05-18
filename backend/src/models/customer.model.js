const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(140),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(140),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "customers"
});

module.exports = Customer;
