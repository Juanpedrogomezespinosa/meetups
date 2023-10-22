const getPool = require("../../db/getPool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();
    const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user) {
      throw new Error("Email o contraseña incorrectos");
    }
    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      throw new Error("Email o contraseña incorrectos");
    }
    const tokenData = { id: user.id };
    const token = jwt.sign(tokenData, "shh");
    res.send({ status: "ok", data: { token } });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
