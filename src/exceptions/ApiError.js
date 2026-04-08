const MessageConstant = require("../constant/MessageConstant");

//throw error
class AppError extends Error {
  constructor(code, description) {
    super(description);
    this.code = code;
    this.description = description;
    this.status = "ERROR";
  }
}

class InvalidRequestException extends AppError {
  constructor(message = MessageConstant.INVALID_REQUEST) {
    super(400, message);
  }
}

class NotFoundException extends AppError {
  constructor(message = MessageConstant.NOT_FOUND) {
    super(404, message);
  }
}

class AlredayExistsException extends AppError {
  constructor(message = MessageConstant.ALREADY_EXIST) {
    super(409, message);
  }
}

class UnauthorizedException extends AppError {
  constructor(message = MessageConstant.UNAUTHORIZED) {
    super(401, message);
  }
}

class AccessDeniedError extends AppError {
  constructor(message = MessageConstant.ACCESS_DENIED) {
    super(403, message);
  }
}
module.exports = {
  InvalidRequestException,
  NotFoundException,
  AlredayExistsException,
  UnauthorizedException,
  AccessDeniedError,
};
