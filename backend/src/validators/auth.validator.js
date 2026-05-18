const { z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1),
    password: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

module.exports = { loginSchema };
