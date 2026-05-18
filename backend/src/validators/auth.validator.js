const { z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres").max(60),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(128)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

module.exports = { loginSchema };
