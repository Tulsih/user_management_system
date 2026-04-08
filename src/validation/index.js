const user = require("./userValidation");

const validate = async (schema, data) => {
  try {
    const validateData = await schema.parseAsync(data);
    return {
      success: true,
      data: validateData,
    };
  } catch (error) {
    console.log("error", error);
    const errorDetail = error.issues?.[0];
    console.log("errorDetail: ", errorDetail);
    return {
      success: false,
      // code: errorDetail.code,
      message: errorDetail.message,
      path: errorDetail.path,
    };
  }
};

module.exports = validate;
