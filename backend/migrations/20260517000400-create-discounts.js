"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discounts", {
      id: {
        type: "CHAR(36)",
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("porcentaje", "monto"),
        allowNull: false,
        defaultValue: "porcentaje"
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("discounts");
  }
};
