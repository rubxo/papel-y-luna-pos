const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RequestLog = sequelize.define("RequestLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  path: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  responseTimeMs: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: "request_logs",
  updatedAt: false
});

module.exports = RequestLog;
