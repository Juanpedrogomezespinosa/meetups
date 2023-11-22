const getPool = require("../../db/getPool");

// Función para verificar si un usuario está registrado en una meetup.
const isRegistered = async (req, res, next) => {
  try {
    const { meetupId } = req.params;

    const userId = req.auth.id;

    const pool = getPool();

    const [existingAttendees] = await pool.query(
      "SELECT * FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );

    // Devolver el estado de registro del usuario en la meetup.
    if (existingAttendees.length === 0) {
      res.json({ status: 0 });
    } else {
      res.json({ status: 1 });
    }
  } catch {
    throw new Error("Error al consultar la base de datos");
  }
};

module.exports = isRegistered;
