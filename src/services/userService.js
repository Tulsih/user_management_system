// validation
// buiness logic [repository file access for CRUD]
// res send to controller

const MessageConstant = require("../constant/MessageConstant");
const {
  InvalidRequestException,
  NotFoundException,
} = require("../exceptions/ApiError");
const User = require("../models/user");
const {
  createUser,
  deleteUsers,
  updateUsers,
  getAllUsers,
  getUserbyId,
  getUserbyEmail,
} = require("../repositories/userRepository");
const validate = require("../validation/index");
const userSchema = require("../validation/userValidation");

class UserService {
  //create user
  async createUser(data) {
    try {
      // zod validation
      const valiadtion = await validate(userSchema, data);
      if (!valiadtion.success) {
        throw new InvalidRequestException(valiadtion.message);
      }

      const validateData = valiadtion?.data || {};
      const existsUser = await getUserbyEmail(validateData?.email);
      if (existsUser) {
        throw new InvalidRequestException(MessageConstant.USER_ALREADY_EXIST);
      }

      const savedUser = await createUser(validateData);
      return savedUser;
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  }
  //get all users
  async getAllUsers() {
    return await getAllUsers();
  }

  // get users by id
  async getUserbyId(id) {
    const user = await getUserbyId(id);
    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }
    return user;
  }

  // updated users
  async updateUsers(id, data) {
    // fetch user by id
    const existsUser = await getUserbyId(id);
    if (!existsUser) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }
    // data {fr,ln,mn,dob,pass}
    // updatedReqData {fn}
    // Merge existing data with new data
    const updatedReqData = {
      ...existsUser.toObject(),
      ...data,
    };
    // validate
    const valiadtion = await validate(userSchema, updatedReqData);
    if (!valiadtion?.success) {
      throw new InvalidRequestException(valiadtion?.message);
    }
    // update
    //return response
    return await updateUsers(id, valiadtion.data);
  }

  //delete users
  async deleteUsers(id) {
    return await deleteUsers(id);
  }
}

module.exports = new UserService();
