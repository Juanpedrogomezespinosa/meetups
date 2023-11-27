const getPool = require("../../db/getPool");
const { validationResult } = require("express-validator");

// Función para crear una meetup.
const createMeetup = async (req, res, next) => {
  try {
    const { title, description, theme, location, date, time } = req.body;
    const photo_url = req.file ? req.file.path : null;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }

    const pool = getPool();

    // Insertar una nueva meetup en la base de datos.
    const [result] = await pool.query(
      "INSERT INTO meetup (title, description, theme, location, date, time, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, theme, location, date, time, photo_url]
    );

    const newMeetupId = result.insertId;

    res.status(201).json({
      status: "ok",
      message: "Meetup creado",
      meetupId: newMeetupId,
      photo_url: photo_url,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createMeetup;
