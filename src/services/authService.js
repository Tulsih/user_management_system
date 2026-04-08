//validation
//res sent to controller
const MessageConstant = require("../constant/MessageConstant");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const loginSchema = require("../validation/loginValidation");
const validate = require("../validation/index");
const {
  NotFoundException,
  InvalidRequestException,
  UnauthorizedException,
  AccessDeniedError,
} = require("../exceptions/ApiError");
const { generateToken, verifyToken } = require("../utils/jwtUtils");
require("dotenv").config();
const emailService = require("./emailService");
const { UserStatus } = require("../enum/UserStatus");
const { verify } = require("jsonwebtoken");
const { AccessType } = require("../enum/AccessType");
const { UserRoles } = require("../enum/UserRoles");

//5 login attemptes
const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5;

class AuthService {
  //login send otp
  async login(data) {
    //validation email & passwored login
    const validation = await validate(loginSchema, data);
    if (!validation.success) {
      throw new InvalidRequestException(validation.message);
    }

    const { email, password } = validation.data;

    //check user is existes in database using email
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }

    //chcek if user blaocked
    if (user.status === UserStatus.BLOCK) {
      throw new AccessDeniedError(MessageConstant.ACCOUNT_BLOCK);
    }

    //verify the password using bcrypt
    const ispasswordValid = await bcrypt.compare(password, user.password);
    console.log(" Password valid:", ispasswordValid);

    //wrong password
    //every wrong passwoerd increase attempt count
    if (!ispasswordValid) {
      user.loginAttempts += 1;
      console.log("attempts:", user.loginAttempts);

      //check max count
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.status = UserStatus.BLOCK;

        await user.save();

        //call email services
        await emailService.sendBlockEmail(user);
      }
      await user.save();

      throw new UnauthorizedException(MessageConstant.INVALID_EMAIL_PASSWORED);
    }

    //correct password
    user.loginAttempts = 0;

    //admin bypass otp
    if (user.roles === UserRoles.ADMIN) {
      const payload = {
        userId: user._id,
        roles: user.roles,
        accessType: AccessType.LOGIN,
      };

      const token = generateToken(payload);

      return {
        userId: user._id,
        email: user.email,
        roles: user.roles,
        token,
      };
    }

    //generate otp 6 number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //hased otp
    const hashedOtp = await bcrypt.hash(otp, 10);

    //expiry time
    const otpExpireMinutes = process.env.OTP_EXPIRE_MINUTES;
    const otpExpiryTime = new Date(Date.now() + otpExpireMinutes * 60 * 1000);

    //save otp
    user.otp = hashedOtp;
    user.otpExpires = otpExpiryTime;

    await user.save();

    //send otp email
    await emailService.sendOtpEmail(user, otp);

    //genrate tempjwt
    const tempToken = generateToken(
      {
        userId: user._id,
        roles: user.roles,
        accessType: AccessType.VERIFY_OTP,
      },
      process.env.TEMP_JWT_EXPIRES_IN,
    );

    return {
      message: MessageConstant.OTP_SENT,
      tempToken,
    };
  }

  //verify opt api
  async verifyOtp(data, tempToken) {
    const { email, otp } = data;

    //verify temp token First
    let decoded;
    try {
      decoded = verifyToken(tempToken);
    } catch (error) {
      throw new UnauthorizedException(MessageConstant.INVALID_TOKEN);
    }

    //find user
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }

    //match  user
    if (decoded.userId.toString() !== user._id.toString()) {
      throw new UnauthorizedException(MessageConstant.INVALID_TOKEN);
    }

    //normal user otp required
    if (!user.otp || !user.otpExpires) {
      throw new InvalidRequestException(MessageConstant.OTP_NOT_FOUND);
    }

    //check expiry time
    if (Date.now() > user.otpExpires) {
      throw new InvalidRequestException(MessageConstant.OTP_EXPIRED);
    }

    //compre otp
    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      throw new unAuthorizeResponse(MessageConstant.INVALID_OTP);
    }

    //clear otp after success
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    //JWT payload
    const payload = {
      userId: user._id,
      roles: user.roles,
      accessType: AccessType.LOGIN,
    };

    //Genrate JWT Tokens
    const token = generateToken(payload);

    return {
      userId: user._id,
      email: user.email,
      roles: user.roles,
      token,
    };
  }
}

module.exports = new AuthService();
