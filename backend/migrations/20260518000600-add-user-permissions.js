"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "permissions", {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: "[]"
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "permissions");
  }
};
