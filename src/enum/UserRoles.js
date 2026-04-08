const { object } = require("zod");

const UserRoles = {
  ADMIN: "ADMIN",
  USER: "USER",
  ANONYMOUS: "ANONYMOUS",
};
const listUserRoles = Object.values(UserRoles);

module.exports = { UserRoles, listUserRoles };
