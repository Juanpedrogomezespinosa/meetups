const jwt = require("jsonwebtoken");

const validateAuth = (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    const tokenData = jwt.verify(token, "shh");

    req.auth = tokenData;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateAuth;
