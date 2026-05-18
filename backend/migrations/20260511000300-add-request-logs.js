"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("request_logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      responseTimeMs: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ip: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("request_logs");
  }
};
