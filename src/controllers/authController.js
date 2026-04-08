const response = require("../helper/generalResponse");
const MessageConstant = require("../constant/MessageConstant");
const authService = require("../services/authService");
const User = require("../models/user");
const { UserStatus } = require("../enum/UserStatus");
const { UserRoles } = require("../enum/UserRoles");

class authController {
  //login user
  async login(req, res, next) {
    try {
      //call auth services
      const result = await authService.login(req.body);
      console.log(authService);

      //if admin login
      if (result.roles === UserRoles.ADMIN) {
        return response.getOkResponse(
          res,
          result,
          MessageConstant.ADMIN_LOGIN_SUCCESS,
        );
      }

      //normal user
      return response.getOkResponse(res, result, MessageConstant.OTP_SENT);
    } catch (error) {
      console.log("error:", error);
      next(error);
    }
  }

  //verify otp api
  async verifyOtp(req, res, next) {
    try {
      //call verifyOtp services
      const result = await authService.verifyOtp(req.body, req.tempToken);

      return response.getOkResponse(res, result, MessageConstant.LOGIN_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  //admin unblocks a user
  async unblockUser(req, res, next) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return response.notFoundResponse(res, MessageConstant.USER_NOT_FOUND);
      }

      user.status = UserStatus.ACTIVE;
      user.loginAttempts = 0;

      await user.save();

      return response.updatedResponse(
        res,
        user,
        MessageConstant.USER_UNBLOCKED,
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new authController();
