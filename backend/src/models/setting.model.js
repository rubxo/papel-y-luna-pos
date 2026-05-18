const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Setting = sequelize.define("Setting", {
  key: {
    type: DataTypes.STRING(80),
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  label: {
    type: DataTypes.STRING(120),
    allowNull: true
  }
}, {
  tableName: "settings"
});

module.exports = Setting;
