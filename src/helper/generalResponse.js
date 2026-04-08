const MessageConstant = require("../constant/MessageConstant");

class GeneralResponse {
  constructor(res, data, code, status, description) {
    this.data = data;
    this.status = status;
    this.code = code;
    this.description = description;
    if (res) {
      res.status(code).json({
        data,
        status: {
          status: status,
          code: code,
          description: description,
        },
      });
    }
  }

  //200 ok
  static getOkResponse(res, data, description = MessageConstant.OK_RESPONSE) {
    return new GeneralResponse(
      res,
      data,
      200,
      MessageConstant.SUCCESS,
      description,
    );
  }

  //201 Created
  static createdResponse(
    res,
    data,
    description = MessageConstant.USER_CREATED,
  ) {
    return new GeneralResponse(
      res,
      data,
      201,
      MessageConstant.SUCCESS,
      description,
    );
  }
  //200 Updated
  static updatedResponse(res, data, description = MessageConstant.USER_UPDATE) {
    return new GeneralResponse(
      res,
      data,
      200,
      MessageConstant.SUCCESS,
      description,
    );
  }
  //200 Deleted
  static deletedResponse(res, description = MessageConstant.USER_DELETE) {
    return new GeneralResponse(
      res,
      null,
      200,
      MessageConstant.SUCCESS,
      description,
    );
  }

  //400 Bad Request
  static badRequestResponse(
    res,
    description = MessageConstant.BAD_REQUEST_ERROR,
  ) {
    return new GeneralResponse(
      res,
      null,
      400,
      MessageConstant.ERROR,
      description,
    );
  }
  //401 Unauthorized
  static unAuthorizeResponse(
    res,
    description = MessageConstant.UNAUTHORIZED_ERROR,
  ) {
    return new GeneralResponse(
      res,
      null,
      401,
      MessageConstant.ERROR,
      description,
    );
  }

  //404 NotFound
  static notFoundResponse(res, description = MessageConstant.USER_NOT_FOUND) {
    return new GeneralResponse(
      res,
      null,
      404,
      MessageConstant.ERROR,
      description,
    );
  }
  //409 Conflict Email already exists
  static conflictResponse(res, description = MessageConstant.EMAIL_EXISTING) {
    return new GeneralResponse(
      res,
      null,
      409,
      MessageConstant.ERROR,
      description,
    );
  }
  //500 Internal Server Error
  static InternalServerError(res, description = MessageConstant.SERVER_ERROR) {
    return new GeneralResponse(
      res,
      null,
      500,
      MessageConstant.ERROR,
      description,
    );
  }
}

module.exports = GeneralResponse;
