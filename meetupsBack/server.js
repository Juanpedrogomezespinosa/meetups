const express = require("express");
const multer = require("multer");
const path = require("path");
const registerUser = require("./controllers/users/registerUser");
const loginUser = require("./controllers/users/loginUser");
const validateAuth = require("./middleware/validateAuth");
const meetupController = require("./controllers/meetup/meetupController");
const { body } = require("express-validator");
const validateMeetupAuth = require("./middleware/validateMeetAuth");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const getPool = require("./db/getPool.js");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors({ origin: ["http://localhost:5173"] }));

app.use(express.json());

app.post("/register", registerUser);
app.post("/login", loginUser);

app.get("/meetups", meetupController.listMeetups);
app.get("/meetups/filter", meetupController.filterMeetups);
app.get("/meetups/:meetupId", meetupController.getMeetupDetails);

app.get("/meetups/:meetupId/attendees", meetupController.getAttendeesCount);

app.post("/meetups/:meetupId/join", validateAuth, meetupController.joinMeetup);
app.post(
  "/meetups/:meetupId/leave",
  validateAuth,
  meetupController.leaveMeetup
);

app.post(
  "/meetups/:meetupId/registered",
  validateAuth,
  meetupController.isRegistered
);

// Middleware para permitir el acceso a la carpeta de imágenes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const randomName = uuidv4();
    const uniqueFileName = `${randomName}${fileExtension}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage });

// Ruta para crear una meetup con una imagen en form-data
app.post("/meetup", upload.single("meetupImage"), async (req, res, next) => {
  try {
    const { title, description, theme, location, date, time } = req.body;
    const photo_url = req.file ? req.file.path : null; // Obtén la ruta de la imagen subida

    if (!title || !description || !theme || !location || !date || !time) {
      return res.status(400).json({
        status: "error",
        message: "Por favor, complete todos los campos obligatorios.",
      });
    }

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO meetup (title, description, theme, location, date, time, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, theme, location, date, time, photo_url]
    );

    const newMeetupId = result.insertId;
    const [[createdMeetup]] = await pool.query(
      "SELECT *, (SELECT COUNT(*) FROM meetup_attendees WHERE meetup_id = ?) as attendees FROM meetup WHERE id = ? AND date >= CURDATE()",
      [newMeetupId, newMeetupId]
    );

    res.status(201).json({
      status: "ok",
      message: "Meetup creado",
      meetup: createdMeetup,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(3070, () => {
  console.log("server listening on http://localhost:3070");
});
