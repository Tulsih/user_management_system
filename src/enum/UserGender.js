const { object } = require("zod");

const UserGender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
const listUserGender = Object.values(UserGender);

module.exports = { UserGender, listUserGender };
