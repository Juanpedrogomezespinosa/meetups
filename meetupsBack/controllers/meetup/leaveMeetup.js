const getPool = require("../../db/getPool");

//Función para darse de baja de una meetup.
const leaveMeetup = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const userId = req.auth.id;
    const pool = getPool();

    const [existingAttendees] = await pool.query(
      "SELECT * FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );

    // Verificar si el usuario está inscrito en la meetup.
    if (existingAttendees.length === 0) {
      throw new Error("No estás inscrito en este meetup");
    }

    // Eliminar la inscripción del usuario a la meetup.
    await pool.query(
      "DELETE FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );

    await pool.query(
      "UPDATE meetup SET attendees = attendees - 1 WHERE id = ?",
      [meetupId]
    );

    res.json({
      status: "ok",
      message: "Te has dado de baja del meetup",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = leaveMeetup;
