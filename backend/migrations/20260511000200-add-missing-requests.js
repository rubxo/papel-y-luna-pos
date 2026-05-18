"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("missing_requests", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      product_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("agotado", "no_registrado"),
        allowNull: false,
        defaultValue: "agotado"
      },
      status: {
        type: Sequelize.ENUM("pendiente", "resuelto", "descartado"),
        allowNull: false,
        defaultValue: "pendiente"
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      notes: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      suggested_supplier: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("missing_requests");
  }
};
