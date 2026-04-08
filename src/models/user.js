// defined model
//user schema
const mongoose = require("mongoose");
const { string } = require("zod");
const { listUserStatus, UserStatus } = require("../enum/UserStatus");
const { listUserRoles, UserRoles } = require("../enum/UserRoles");
const { listUserGender } = require("../enum/UserGender");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
    },
    initialLetter: {
      type: String,
      maxlength: 2,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: listUserGender,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    mobileNumber: {
      type: string,
    },
    status: {
      type: String,
      enum: listUserStatus,
      default: UserStatus.ACTIVE,
    },
    roles: {
      type: String,
      enum: listUserRoles,
      default: UserRoles.USER,
    },
    softDelete: {
      type: Boolean,
      default: false,
    },

    //login Attempts
    loginAttempts: {
      type: Number,
      default: 0,
    },

    otp: {
      type: string,
    },

    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, //createAt , updatedAt
  },
);

module.exports = mongoose.model("Users", UserSchema);
