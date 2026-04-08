//globle errorHandler middelware
const GeneralResponse = require("../helper/generalResponse");
const MessageConstant = require("../constant/MessageConstant");

const errorHandler = (err, req, res, next) => {
  const code = err.code || 500;
  const description = err.description || MessageConstant.SERVER_ERROR;

  return new GeneralResponse(
    res,
    null,
    code,
    MessageConstant.ERROR,
    description,
  );
};
module.exports = errorHandler;
