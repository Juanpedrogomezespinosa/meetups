const getPool = require("../../db/getPool");
const { validationResult } = require("express-validator");

const createMeetup = async (req, res, next) => {
  try {
    const { title, description, theme, location, date, time } = req.body;
    const photo_url = req.file ? req.file.path : null; // Obtén la ruta de la imagen subida

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO meetup (title, description, theme, location, date, time, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, theme, location, date, time, photo_url]
    );

    const newMeetupId = result.insertId;

    res
      .status(201)
      .json({ status: "ok", message: "Meetup creado", meetupId: newMeetupId });
  } catch (error) {
    next(error);
  }
};

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

const filterMeetups = async (req, res, next) => {
  try {
    const { city, theme } = req.query;
    const pool = getPool();
    const [meetups] = await pool.query(
      "SELECT * FROM meetup WHERE location = ? AND theme = ? AND date >= CURDATE() ORDER BY date ASC",
      [city, theme]
    );
    res.json({ status: "ok", data: meetups });
  } catch (error) {
    next(error);
  }
};

const getMeetupDetails = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const pool = getPool();
    const [[meetup]] = await pool.query(
      "SELECT *, (SELECT COUNT(*) FROM meetup_attendees WHERE meetup_id = ?) as attendees FROM meetup WHERE id = ? AND date >= CURDATE()",
      [meetupId, meetupId]
    );
    if (!meetup) {
      throw new Error("Meetup no encontrado");
    }
    res.json({ status: "ok", data: meetup });
  } catch (error) {
    next(error);
  }
};

const joinMeetup = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const userId = req.auth.id;
    const pool = getPool();

    const [existingAttendees] = await pool.query(
      "SELECT * FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );
    if (existingAttendees.length > 0) {
      res.json({
        status: "OK",
        message: "Ya estás inscrito en el meetup.",
        statusCode: 201,
      });
      return;
    }

    await pool.query(
      "INSERT INTO meetup_attendees (meetup_id, user_id) VALUES (?, ?)",
      [meetupId, userId]
    );

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

const isRegistered = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const userId = req.auth.id;
    const pool = getPool();
    const [existingAttendees] = await pool.query(
      "SELECT * FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );
    if (existingAttendees.length === 0) {
      res.json({ status: 0 });
    } else {
      res.json({ status: 1 });
    }
  } catch {
    throw new Error("Error al consultar la base de datos");
  }
};

const leaveMeetup = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const userId = req.auth.id;
    const pool = getPool();

    const [existingAttendees] = await pool.query(
      "SELECT * FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );
    if (existingAttendees.length === 0) {
      throw new Error("No estás inscrito en este meetup");
    }

    await pool.query(
      "DELETE FROM meetup_attendees WHERE meetup_id = ? AND user_id = ?",
      [meetupId, userId]
    );

    await pool.query(
      "UPDATE meetup SET attendees = attendees - 1 WHERE id = ?",
      [meetupId]
    );

    res.json({ status: "ok", message: "Te has dado de baja del meetup" });
  } catch (error) {
    next(error);
  }
};

const getAttendeesCount = async (req, res, next) => {
  try {
    const { meetupId } = req.params;
    const pool = getPool();
    const [[meetup]] = await pool.query(
      "SELECT COUNT(*) as attendees FROM meetup_attendees WHERE meetup_id = ?",
      [meetupId]
    );
    res.json({ status: "ok", attendees: meetup.attendees });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendeesCount,
};

module.exports = {
  listMeetups,
  filterMeetups,
  getMeetupDetails,
  joinMeetup,
  leaveMeetup,
  createMeetup,
  isRegistered,
  getAttendeesCount,
};
