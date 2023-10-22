const getPool = require("../../db/getPool");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length > 0) {
      throw new Error("Ya existe un usuario con ese email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
    res.status(201).send({ status: "ok", message: "Usuario creado" });
  } catch (error) {
    next(error);
  }
};

module.exports = registerUser;
