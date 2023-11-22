const getPool = require("../../db/getPool");

// Función para unirse a una meetup.
const joinMeetup = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const userId = req.auth.id;
    const pool = getPool();

    const [existingAttendees] = await pool.query(
      "SELECT * FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );

    // Verificar si el usuario ya está inscrito en la meetup.
    if (existingAttendees.length > 0) {
      res.json({
        status: "OK",
        message: "Ya estás inscrito en el meetup.",
        statusCode: 201,
      });
      return;
    }

    // Insertar la inscripción del usuario a la meetup.
    await pool.query(
      "INSERT INTO meetup_attendees (meetup_id, user_id) VALUES (?, ?)",
      [meetupId, userId]
    );

    // Actualizar el contador de asistentes en la meetup.
    await pool.query(
      "UPDATE meetup SET attendees = attendees + 1 WHERE id = ?",
      [meetupId]
    );

    res.json({
      status: "ok",
      message: "Te has inscrito en el meetup",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = joinMeetup;
