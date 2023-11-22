const getPool = require("../../db/getPool");

// Función para filtrar meetups por ciudad y tema.
const filterMeetups = async (req, res, next) => {
  try {
    const { city, theme } = req.query;

    const pool = getPool();

    // Consulta para obtener meetups filtradas por ciudad y tema, con fecha posterior o igual a la fecha actual, ordenadas por fecha ascendente.
    const [meetups] = await pool.query(
      "SELECT * FROM meetup WHERE location = ? AND theme = ? AND date >= CURDATE() ORDER BY date ASC",
      [city, theme]
    );

    res.json({
      status: "ok",
      data: meetups,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = filterMeetups;
