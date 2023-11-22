const getPool = require("../../db/getPool");

//Función para obtener la lista de meetups.
const listMeetups = async (req, res, next) => {
  try {
    const pool = getPool();

    const [meetups] = await pool.query(
      "SELECT * FROM meetup WHERE date >= CURDATE() ORDER BY date ASC"
    );

    res.json({ status: "ok", data: meetups });
  } catch (error) {
    next(error);
  }
};

module.exports = listMeetups;
