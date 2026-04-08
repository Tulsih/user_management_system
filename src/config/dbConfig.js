// database connection

const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(" ✅  mongoDB connected");
  } catch (error) {
    console.log(" ❌ mongodb connection error :", error);
  }
};

// module.exports = { connectDatabase };
module.exports = connectDatabase;
