const jwt = require("jsonwebtoken");

const validateMeetupAuth = (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      throw new Error(
        "Acceso no autorizado. Token de autenticación no proporcionado."
      );
    }

    const tokenData = jwt.verify(token, "shh");

    req.auth = tokenData;

    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Acceso no autorizado" });
  }
};

module.exports = validateMeetupAuth;
