const { z } = require("zod");

const productBody = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  code: z.string().min(1).max(40),
  name: z.string().min(1).max(160),
  description: z.string().max(500).optional().nullable(),
  salePrice: z.coerce.number().min(0),
  costPrice: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0).default(0),
  trackInventory: z.boolean().optional(),
  imageUrl: z.string().max(500).optional().nullable(),
  active: z.boolean().optional()
});

const createProductSchema = z.object({
  body: productBody,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const updateProductSchema = z.object({
  body: productBody.partial(),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).optional()
});

module.exports = { createProductSchema, updateProductSchema };
