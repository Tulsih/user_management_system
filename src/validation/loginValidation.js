const z = require("zod");
const MessageConstant = require("../constant/MessageConstant");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const login = z.object({
  email: z
    .string()
    .trim()
    .regex(emailRegex, MessageConstant.INVALID_EMAIL_FORMATE),

  // password
  password: z.string().min(8),
});

module.exports = login;
