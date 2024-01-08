const { z } = require("zod");
const userCreateSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  status: z
    .string()
    .regex(/CUSTOMER|SELLER|DRIVER/)
    .default("CUSTOMER"),
  address: z.string().nonempty(),
  phone: z.string().nonempty(),
  password: z.string().nonempty(),
});
const userUpdateSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  status: z
    .string()
    .regex(/CUSTOMER|SELLER|DRIVER/)
    .default("CUSTOMER"),
  address: z.string().nonempty(),
  phone: z.string().nonempty(),
  password: z.string().nonempty(),
});

module.exports = { userCreateSchema, userUpdateSchema };
