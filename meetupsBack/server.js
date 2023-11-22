require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const registerUser = require("./controllers/users/registerUser");
const loginUser = require("./controllers/users/loginUser");
const validateAuth = require("./middleware/validateAuth");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const getPool = require("./db/getPool.js");
const { v4: uuidv4 } = require("uuid");

const cors = require("cors");

app.use(cors({ origin: ["http://localhost:5173"] }));

app.use(express.json());

app.post("/register", registerUser);
app.post("/login", loginUser);

const meetupController = require("./controllers/meetup/meetupController");

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
app.post(
  "/meetup",
  upload.single("meetupImage"),
  meetupController.createMeetup
);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
