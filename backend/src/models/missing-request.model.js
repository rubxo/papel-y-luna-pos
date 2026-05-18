const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MissingRequest = sequelize.define("MissingRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM("agotado", "no_registrado"),
    allowNull: false,
    defaultValue: "agotado"
  },
  status: {
    type: DataTypes.ENUM("pendiente", "resuelto", "descartado"),
    allowNull: false,
    defaultValue: "pendiente"
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  suggestedSupplier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "missing_requests"
});

module.exports = MissingRequest;
