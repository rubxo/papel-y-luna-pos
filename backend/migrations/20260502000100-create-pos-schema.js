"use strict";

const uuid = {
  type: "CHAR(36)",
  allowNull: false
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: { ...uuid, primaryKey: true },
      name: { type: Sequelize.ENUM("admin", "cajero"), allowNull: false, unique: true },
      label: { type: Sequelize.STRING(80), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("users", {
      id: { ...uuid, primaryKey: true },
      role_id: { ...uuid, references: { model: "roles", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      full_name: { type: Sequelize.STRING(120), allowNull: false },
      username: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      last_login_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("categories", {
      id: { ...uuid, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(255), allowNull: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("products", {
      id: { ...uuid, primaryKey: true },
      category_id: { type: "CHAR(36)", allowNull: true, references: { model: "categories", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      code: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(160), allowNull: false },
      description: { type: Sequelize.STRING(500), allowNull: true },
      sale_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      cost_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      track_inventory: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("customers", {
      id: { ...uuid, primaryKey: true },
      name: { type: Sequelize.STRING(140), allowNull: false },
      phone: { type: Sequelize.STRING(40), allowNull: true },
      email: { type: Sequelize.STRING(140), allowNull: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("suppliers", {
      id: { ...uuid, primaryKey: true },
      name: { type: Sequelize.STRING(140), allowNull: false },
      tax_id: { type: Sequelize.STRING(60), allowNull: true },
      contact: { type: Sequelize.STRING(140), allowNull: true },
      phone: { type: Sequelize.STRING(40), allowNull: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("sales", {
      id: { ...uuid, primaryKey: true },
      user_id: { ...uuid, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      customer_id: { type: "CHAR(36)", allowNull: true, references: { model: "customers", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      sale_number: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      status: { type: Sequelize.ENUM("cerrada", "anulada", "corregida"), allowNull: false, defaultValue: "cerrada" },
      payment_method: { type: Sequelize.ENUM("efectivo", "tarjeta", "transferencia", "nequi", "debe"), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discount_type: { type: Sequelize.ENUM("porcentaje", "monto"), allowNull: true },
      discount_value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      discount_total: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      tax_total: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      amount_received: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      change_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      notes: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("sale_items", {
      id: { ...uuid, primaryKey: true },
      sale_id: { ...uuid, references: { model: "sales", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      product_id: { ...uuid, references: { model: "products", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      product_name: { type: Sequelize.STRING(160), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("purchases", {
      id: { ...uuid, primaryKey: true },
      supplier_id: { type: "CHAR(36)", allowNull: true, references: { model: "suppliers", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      user_id: { ...uuid, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      purchase_number: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      payment_method: { type: Sequelize.ENUM("efectivo", "tarjeta", "transferencia", "nequi"), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      notes: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("purchase_items", {
      id: { ...uuid, primaryKey: true },
      purchase_id: { ...uuid, references: { model: "purchases", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      product_id: { ...uuid, references: { model: "products", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unit_cost: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("refunds", {
      id: { ...uuid, primaryKey: true },
      sale_id: { ...uuid, references: { model: "sales", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      user_id: { ...uuid, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      type: { type: Sequelize.ENUM("total", "parcial"), allowNull: false },
      reason: { type: Sequelize.STRING(500), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      restock: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("refund_items", {
      id: { ...uuid, primaryKey: true },
      refund_id: { ...uuid, references: { model: "refunds", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      sale_item_id: { ...uuid, references: { model: "sale_items", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      product_id: { ...uuid, references: { model: "products", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("sale_corrections", {
      id: { ...uuid, primaryKey: true },
      sale_id: { ...uuid, references: { model: "sales", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      user_id: { ...uuid, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      reason: { type: Sequelize.STRING(500), allowNull: false },
      before_data: { type: Sequelize.JSON, allowNull: false },
      after_data: { type: Sequelize.JSON, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("inventory_movements", {
      id: { ...uuid, primaryKey: true },
      product_id: { ...uuid, references: { model: "products", key: "id" }, onUpdate: "CASCADE", onDelete: "RESTRICT" },
      user_id: { type: "CHAR(36)", allowNull: true, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      type: { type: Sequelize.ENUM("compra", "venta", "reembolso", "correccion", "anulacion", "ajuste"), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      stock_before: { type: Sequelize.INTEGER, allowNull: false },
      stock_after: { type: Sequelize.INTEGER, allowNull: false },
      reference_type: { type: Sequelize.STRING(40), allowNull: true },
      reference_id: { type: "CHAR(36)", allowNull: true },
      notes: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("audit_logs", {
      id: { ...uuid, primaryKey: true },
      user_id: { type: "CHAR(36)", allowNull: true, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      action: { type: Sequelize.STRING(80), allowNull: false },
      entity: { type: Sequelize.STRING(80), allowNull: false },
      entity_id: { type: "CHAR(36)", allowNull: true },
      details: { type: Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("settings", {
      key: { type: Sequelize.STRING(80), primaryKey: true },
      value: { type: Sequelize.STRING(255), allowNull: false },
      label: { type: Sequelize.STRING(120), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("settings");
    await queryInterface.dropTable("audit_logs");
    await queryInterface.dropTable("inventory_movements");
    await queryInterface.dropTable("sale_corrections");
    await queryInterface.dropTable("refund_items");
    await queryInterface.dropTable("refunds");
    await queryInterface.dropTable("purchase_items");
    await queryInterface.dropTable("purchases");
    await queryInterface.dropTable("sale_items");
    await queryInterface.dropTable("sales");
    await queryInterface.dropTable("suppliers");
    await queryInterface.dropTable("customers");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("categories");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
  }
};
