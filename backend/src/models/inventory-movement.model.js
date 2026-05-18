const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InventoryMovement = sequelize.define("InventoryMovement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM("compra", "venta", "reembolso", "correccion", "anulacion", "ajuste"),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockBefore: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockAfter: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  referenceType: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: "inventory_movements"
});

module.exports = InventoryMovement;
