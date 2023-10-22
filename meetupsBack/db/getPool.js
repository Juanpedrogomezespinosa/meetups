const mysql = require("mysql2/promise");

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      port: 3306,
      user: "demo",
      password: "12345678",
      database: "meetup",
      timezone: "local",
    });
  }

  return pool;
};

module.exports = getPool;
