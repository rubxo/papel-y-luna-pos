const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RefundItem = sequelize.define("RefundItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  refundId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  saleItemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: "refund_items"
});

module.exports = RefundItem;
