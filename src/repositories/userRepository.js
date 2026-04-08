// CRUD Operation
const MessageConstant = require("../constant/MessageConstant");
const { NotFoundException } = require("../exceptions/ApiError");
const Users = require("../models/user");

//create users
const createUser = async (userData) => {
  const user = new Users(userData);
  return await user.save();
  //save user object into databse
  //also writen like this
  //return await Users.create(userData);
};

//get all users
const getAllUsers = async () => {
  return await Users.find({ softDelete: false });
};

//get users by id
const getUserbyId = async (id) => {
  const user = await Users.findOne({ _id: id, softDelete: false });

  if (!user) {
    throw new Error(MessageConstant.USER_NOT_FOUND);
  }
  return user;
};

//updated users (only if not delted)
const updateUsers = async (id, upadteData) => {
  return await Users.findOneAndUpdate(
    { _id: id, softDelete: false },
    upadteData,
    {
      new: true,
      runValidators: true,
    },
  );
};

//deleted users(soft delete user)
const deleteUsers = async (id) => {
  const deleteUsers = await Users.findOneAndUpdate(
    { _id: id, softDelete: false },
    { softDelete: true },
    { new: true },
  );

  if (!deleteUsers) {
    throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
  }
  return { message: MessageConstant.USER_DELETE };
};

const getUserbyEmail = async (email) => {
  return await Users.findOne({ email, softDelete: false });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserbyId,
  updateUsers,
  deleteUsers,
  getUserbyEmail,
};
