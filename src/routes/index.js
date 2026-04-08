const express = require("express");
const route = express();

const userRoute = require("./userRoute");

//main routes
route.use("/users", userRoute);

module.exports = route;
