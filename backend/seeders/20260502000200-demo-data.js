"use strict";

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const now = () => new Date();

module.exports = {
  async up(queryInterface) {
    const { faker } = await import("@faker-js/faker");

    const roles = {
      admin: randomUUID(),
      cajero: randomUUID()
    };

    await queryInterface.bulkInsert("roles", [
      { id: roles.admin, name: "admin", label: "Administrador", created_at: now(), updated_at: now() },
      { id: roles.cajero, name: "cajero", label: "Cajero", created_at: now(), updated_at: now() }
    ]);

    await queryInterface.bulkInsert("users", [
      { id: randomUUID(), role_id: roles.admin, full_name: "Administrador Papel & Luna", username: "admin", password_hash: await bcrypt.hash("admin123", 10), active: true, created_at: now(), updated_at: now() },
      { id: randomUUID(), role_id: roles.cajero, full_name: "Cajero Principal", username: "cajero", password_hash: await bcrypt.hash("cajero123", 10), active: true, created_at: now(), updated_at: now() }
    ]);

    const categories = [
      "Escritura",
      "Cuadernos y papel",
      "Arte y dibujo",
      "Oficina",
      "Manualidades",
      "Escolar",
      "Impresión",
      "Tecnología básica"
    ].map((name) => ({
      id: randomUUID(),
      name,
      description: `Productos de ${name.toLowerCase()}`,
      active: true,
      created_at: now(),
      updated_at: now()
    }));

    await queryInterface.bulkInsert("categories", categories);

    const productNames = [
      "Cuaderno cuadriculado 100 hojas",
      "Cuaderno rayado 50 hojas",
      "Lápiz HB",
      "Bolígrafo azul",
      "Bolígrafo negro",
      "Marcador permanente",
      "Resaltador amarillo",
      "Borrador nata",
      "Sacapuntas metálico",
      "Regla 30 cm",
      "Cartulina blanca",
      "Papel iris",
      "Tijeras escolares",
      "Pegante en barra",
      "Cinta transparente",
      "Carpeta oficio",
      "Sobre manila",
      "Resma carta",
      "Colores x12",
      "Temperas x6"
    ];

    const products = Array.from({ length: 80 }, (_, index) => {
      const cost = faker.number.float({ min: 500, max: 18000, fractionDigits: 2 });
      const price = Math.round(cost * faker.number.float({ min: 1.25, max: 1.8, fractionDigits: 2 }));
      return {
        id: randomUUID(),
        category_id: faker.helpers.arrayElement(categories).id,
        code: `PL-${String(index + 1).padStart(4, "0")}`,
        name: index < productNames.length ? productNames[index] : faker.commerce.productName(),
        description: faker.commerce.productDescription().slice(0, 240),
        sale_price: price,
        cost_price: cost,
        stock: faker.number.int({ min: 0, max: 120 }),
        track_inventory: true,
        image_url: null,
        active: true,
        created_at: now(),
        updated_at: now()
      };
    });

    await queryInterface.bulkInsert("products", products);

    await queryInterface.bulkInsert("customers", Array.from({ length: 30 }, () => ({
      id: randomUUID(),
      name: faker.person.fullName(),
      phone: faker.phone.number().slice(0, 40),
      email: faker.internet.email().toLowerCase(),
      active: true,
      created_at: now(),
      updated_at: now()
    })));

    await queryInterface.bulkInsert("suppliers", Array.from({ length: 12 }, () => ({
      id: randomUUID(),
      name: faker.company.name(),
      tax_id: faker.string.numeric(9),
      contact: faker.person.fullName(),
      phone: faker.phone.number().slice(0, 40),
      active: true,
      created_at: now(),
      updated_at: now()
    })));

    await queryInterface.bulkInsert("settings", [
      { key: "business_name", value: "Papel & Luna", label: "Nombre del negocio", created_at: now(), updated_at: now() },
      { key: "iva_rate", value: "0.19", label: "IVA", created_at: now(), updated_at: now() },
      { key: "low_stock_threshold", value: "10", label: "Alerta de stock bajo", created_at: now(), updated_at: now() }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("settings", null, {});
    await queryInterface.bulkDelete("suppliers", null, {});
    await queryInterface.bulkDelete("customers", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  }
};
