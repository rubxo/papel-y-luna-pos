const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Discount = sequelize.define("Discount", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM("porcentaje", "monto"),
    allowNull: false,
    defaultValue: "porcentaje"
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "discounts"
});

module.exports = Discount;
