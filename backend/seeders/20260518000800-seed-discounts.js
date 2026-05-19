"use strict";

const { randomUUID } = require("crypto");
const now = () => new Date();

module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM discounts",
      { plain: true }
    );
    if (existing && Number(existing.count) > 0) return;

    await queryInterface.bulkInsert("discounts", [
      {
        id: randomUUID(),
        name: "Descuento estudiante",
        type: "porcentaje",
        value: 5,
        description: "5% para estudiantes con carné",
        active: true,
        created_at: now(),
        updated_at: now()
      },
      {
        id: randomUUID(),
        name: "Descuento al por mayor",
        type: "porcentaje",
        value: 10,
        description: "10% en compras de 5 unidades o más del mismo producto",
        active: true,
        created_at: now(),
        updated_at: now()
      },
      {
        id: randomUUID(),
        name: "Promoción escolar",
        type: "porcentaje",
        value: 15,
        description: "15% en temporada de regreso a clases",
        active: false,
        created_at: now(),
        updated_at: now()
      },
      {
        id: randomUUID(),
        name: "Descuento fijo $2.000",
        type: "monto",
        value: 2000,
        description: "Descuento fijo de $2.000 en cualquier compra",
        active: true,
        created_at: now(),
        updated_at: now()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("discounts", null, {});
  }
};
