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

// Importa las funciones de meetup directamente desde sus archivos individuales
const listMeetups = require("./controllers/meetup/listMeetups");
const filterMeetups = require("./controllers/meetup/filterMeetups");
const getMeetupDetails = require("./controllers/meetup/getMeetupDetails");
const getAttendeesCount = require("./controllers/meetup/getAttendeesCount");
const joinMeetup = require("./controllers/meetup/joinMeetup");
const leaveMeetup = require("./controllers/meetup/leaveMeetup");
const isRegistered = require("./controllers/meetup/isRegistered");
const createMeetup = require("./controllers/meetup/createMeetup");

app.get("/meetups", listMeetups);
app.get("/meetups/filter", filterMeetups);
app.get("/meetups/:meetupId", getMeetupDetails);
app.get("/meetups/:meetupId/attendees", getAttendeesCount);

app.post("/meetups/:meetupId/join", validateAuth, joinMeetup);
app.post("/meetups/:meetupId/leave", validateAuth, leaveMeetup);
app.post("/meetups/:meetupId/registered", validateAuth, isRegistered);

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
app.post("/meetup", upload.single("meetupImage"), createMeetup);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
