const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SaleCorrection = sequelize.define("SaleCorrection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  saleId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  beforeData: {
    type: DataTypes.JSON,
    allowNull: false
  },
  afterData: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: "sale_corrections"
});

module.exports = SaleCorrection;
