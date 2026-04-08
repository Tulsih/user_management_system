//genrated tokens and verify tokens

const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;
const DEFAULT_EXPIRES = process.env.JWT_EXPIRES_IN;

const generateToken = (payload, expiresIn = DEFAULT_EXPIRES) => {
  return jwt.sign(payload, SECRET, {
    expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };
