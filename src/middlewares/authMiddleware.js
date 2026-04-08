const jwt = require("jsonwebtoken");
const MessageConstant = require("../constant/MessageConstant");
const response = require("../helper/generalResponse");
require("dotenv").config();
const { verifyToken } = require("../utils/jwtUtils");
const { UserRoles } = require("../enum/UserRoles");
const { decode } = require("../validation/loginValidation");
const { AccessType } = require("../enum/AccessType");
const { UnauthorizedException } = require("../exceptions/ApiError");

//verify Token Middleware
const authenticate = (req, res, next) => {
  try {
    //get authorization token form postmam
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      console.log("Authorization header missing");
      return response.unAuthorizeResponse(
        res,
        MessageConstant.TOKEN_NOT_PROVIDED,
      );
    }
    console.log("auth header :", authHeader);
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.log("invalid token format ", authHeader);
      // Invalid format
      return response.unAuthorizeResponse(res, MessageConstant.INVALID_TOKEN);
    }
    const token = parts[1];
    console.log("extracted token ", token);

    //verify token
    const decoded = verifyToken(token);
    console.log("decoded token ", decoded);

    //check accessType
    if (decoded.accessType !== AccessType.LOGIN) {
      throw new UnauthorizedException(MessageConstant.INVALID_ACCEES_TYPE);
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("jwt verificatio error", error.message);
    return response.unAuthorizeResponse(res, MessageConstant.UNAUTHORIZED);
  }
};

//temp token verify
const verifyTempToken = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      return response.unAuthorizeResponse(
        res,
        MessageConstant.TOKEN_NOT_PROVIDED,
      );
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.log("invalid token format ", authHeader);
      return response.unAuthorizeResponse(res, MessageConstant.INVALID_TOKEN);
    }
    const token = parts[1];
    console.log("extracted token ", token);

    const decode = verifyToken(token);
    console.log("decoded token ", decode);

    if (decode.accessType !== AccessType.VERIFY_OTP) {
      throw new UnauthorizedException(MessageConstant.INVALID_ACCEES_TYPE);
    }

    req.tempToken = token;
    req.tempUser = decode;
    next();
  } catch (error) {
    return response.unAuthorizeResponse(res, MessageConstant.UNAUTHORIZED);
  }
};

//check admin role
const isAdmin = (req, res, next) => {
  if (req.user.roles !== UserRoles.ADMIN) {
    return response.unAuthorizeResponse(res, MessageConstant.ACCESS_DENIED);
  }

  next();
};
module.exports = { authenticate, isAdmin, verifyTempToken };
