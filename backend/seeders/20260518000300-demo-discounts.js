"use strict";

const { randomUUID } = require("crypto");
const now = () => new Date();

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("discounts", [
      {
        id: randomUUID(),
        name: "Descuento estudiante",
        type: "percentage",
        value: 5,
        description: "5% para estudiantes con carné",
        active: true,
        created_at: now(),
        updated_at: now()
      },
      {
        id: randomUUID(),
        name: "Descuento al por mayor",
        type: "percentage",
        value: 10,
        description: "10% en compras de 5 unidades o más del mismo producto",
        active: true,
        created_at: now(),
        updated_at: now()
      },
      {
        id: randomUUID(),
        name: "Promoción escolar",
        type: "percentage",
        value: 15,
        description: "15% en temporada de regreso a clases",
        active: false,
        created_at: now(),
        updated_at: now()
      },
      {
        id: randomUUID(),
        name: "Descuento fijo $2.000",
        type: "fixed",
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
