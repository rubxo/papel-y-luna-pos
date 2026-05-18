const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Purchase = sequelize.define("Purchase", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  purchaseNumber: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true
  },
  paymentMethod: {
    type: DataTypes.ENUM("efectivo", "tarjeta", "transferencia", "nequi", "consignacion"),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: "purchases"
});

module.exports = Purchase;
