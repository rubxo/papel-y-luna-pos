const { z } = require("zod");

const saleItem = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive()
});

const createSaleSchema = z.object({
  body: z.object({
    customerId: z.string().uuid().nullable().optional(),
    paymentMethod: z.enum(["efectivo", "tarjeta", "transferencia", "nequi", "debe"]),
    amountReceived: z.coerce.number().min(0).optional(),
    discountType: z.enum(["porcentaje", "monto"]).nullable().optional(),
    discountValue: z.coerce.number().min(0).optional(),
    notes: z.string().max(500).optional(),
    items: z.array(saleItem).min(1)
  }).superRefine((data, ctx) => {
    if (data.paymentMethod === "debe" && !data.customerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El método de pago 'Debe' requiere asociar un cliente",
        path: ["customerId"]
      });
    }
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const refundSaleSchema = z.object({
  body: z.object({
    type: z.enum(["total", "parcial"]).optional(),
    reason: z.string().min(3).max(500),
    restock: z.boolean().optional(),
    items: z.array(z.object({
      saleItemId: z.string().uuid(),
      quantity: z.coerce.number().int().positive()
    })).min(1)
  }),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).optional()
});

module.exports = { createSaleSchema, refundSaleSchema };
