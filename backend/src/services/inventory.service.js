const { InventoryMovement } = require("../models");

async function moveStock({ product, quantity, type, userId, referenceType, referenceId, notes, transaction }) {
  const stockBefore = Number(product.stock);
  const stockAfter = stockBefore + Number(quantity);

  if (stockAfter < 0) {
    const error = new Error(`Stock insuficiente para ${product.name}. Disponible: ${stockBefore}`);
    error.status = 409;
    throw error;
  }

  product.stock = stockAfter;
  await product.save({ transaction });

  return InventoryMovement.create({
    productId: product.id,
    userId,
    type,
    quantity,
    stockBefore,
    stockAfter,
    referenceType,
    referenceId,
    notes
  }, { transaction });
}

module.exports = { moveStock };
