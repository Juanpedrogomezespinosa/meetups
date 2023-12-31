const jwt = require("jsonwebtoken");

const generateError = require("../utils/generateError");

const validateAuth = (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      generateError("Falta la cabecera de autorización", 401);
    }

    let tokenData;

    try {
      tokenData = jwt.verify(token, process.env.SECRET);

      req.auth = tokenData;

      next();
    } catch (err) {
      console.error(err);

      generateError("Token inválido", 401);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = validateAuth;
