const getPool = require("../../db/getPool");

// Función para obtener el número de asistentes a una meetup.
const getAttendeesCount = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const pool = getPool();
    const [[meetup]] = await pool.query(
      "SELECT COUNT(*) as attendees FROM meetup_attendees WHERE meetup_id = ?",
      [meetupId]
    );

    res.json({
      status: "ok",
      attendees: meetup.attendees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAttendeesCount;
