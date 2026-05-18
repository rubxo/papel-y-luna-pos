const { z } = require("zod");

const idParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).optional()
});

module.exports = { idParamSchema };
