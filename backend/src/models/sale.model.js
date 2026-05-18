const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sale = sequelize.define("Sale", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  saleNumber: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM("cerrada", "anulada", "corregida"),
    allowNull: false,
    defaultValue: "cerrada"
  },
  paymentMethod: {
    type: DataTypes.ENUM("efectivo", "tarjeta", "transferencia", "nequi", "debe"),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountType: {
    type: DataTypes.ENUM("porcentaje", "monto"),
    allowNull: true
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  discountTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  amountReceived: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  changeAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: "sales"
});

module.exports = Sale;
