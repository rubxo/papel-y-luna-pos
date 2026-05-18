const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(140),
    allowNull: true
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  permissions: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "[]"
  }
}, {
  tableName: "users"
});

// Defensa en profundidad: nunca serializar passwordHash hacia el cliente
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.passwordHash;
  delete values.password_hash;
  return values;
};

module.exports = User;
