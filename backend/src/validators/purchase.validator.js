const { z } = require("zod");

const createPurchaseSchema = z.object({
  body: z.object({
    supplierId: z.string().uuid().nullable().optional(),
    paymentMethod: z.enum(["efectivo", "tarjeta", "transferencia", "nequi", "consignacion"]),
    notes: z.string().max(500).optional(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().int().positive(),
      unitCost: z.coerce.number().min(0)
    })).min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

module.exports = { createPurchaseSchema };
