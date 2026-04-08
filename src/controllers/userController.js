// controller req, res, exception
//call services

const response = require("../helper/generalResponse");
const MessageConstant = require("../constant/MessageConstant");
const userService = require("../services/userService");

class UserController {
  //create user
  async createUser(req, res, next) {
    try {
      // call services
      const result = await userService.createUser(req?.body);
      return response.createdResponse(
        res,
        result,
        MessageConstant.USER_CREATED,
      );
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }

  //get  all users
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return response.getOkResponse(res, users);
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }

  //get single user by id
  async getUserbyId(req, res, next) {
    try {
      const users = await userService.getUserbyId(req.params.id);

      return response.getOkResponse(res, users);
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }

  //update the user
  async updateUsers(req, res, next) {
    try {
      const updateUser = await userService.updateUsers(req.params.id, req.body);

      return response.updatedResponse(res, updateUser);
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }

  //delete users
  async deleteUsers(req, res, next) {
    try {
      const deleteuser = await userService.deleteUsers(req.params.id);

      return response.deletedResponse(res, deleteuser);
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }
}
module.exports = new UserController();
