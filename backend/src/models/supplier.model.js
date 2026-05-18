const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(140),
    allowNull: false
  },
  taxId: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  contact: {
    type: DataTypes.STRING(140),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "suppliers"
});

module.exports = Supplier;
