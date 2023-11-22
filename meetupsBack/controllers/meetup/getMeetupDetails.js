const getPool = require("../../db/getPool");

// Función para obtener detalles de una meetup.
const getMeetupDetails = async (req, res, next) => {
  try {
    const { meetupId } = req.params;

    const pool = getPool();

    // Consulta para obtener detalles de una meetup, incluyendo el número de asistentes.
    const [[meetup]] = await pool.query(
      "SELECT *, (SELECT COUNT(*) FROM meetup_attendees WHERE meetup_id = ?) as attendees FROM meetup WHERE id = ? AND date >= CURDATE()",
      [meetupId, meetupId]
    );

    if (!meetup) {
      throw new Error("Meetup no encontrado");
    }

    res.json({
      status: "ok",
      data: meetup,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getMeetupDetails;
