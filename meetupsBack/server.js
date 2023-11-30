// Leemos las variables de entorno del fichero ".env".
require("dotenv").config();

// Importamos las dependencias.
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Importamos las funciones controladoras de los usuarios.
const { registerUser, loginUser } = require("./controllers/users");

// Importamos las funciones controladoras de las meetups.
const {
  createMeetup,
  listMeetups,
  filterMeetups,
  getMeetupDetails,
  joinMeetup,
  leaveMeetup,
  isRegistered,
  getAttendeesCount,
} = require("./controllers/meetup");

// Importamos la función controladora del middleware ruta no encontrada y de manejo de errores.
const { notFoundHandler, errorHandler } = require("./controllers/errors");

// Importamos la función controladora que comprueba la validez del token.
const validateAuth = require("./middleware/validateAuth");

// Creamos el servidor.
const app = express();

// Middleware que evita problemas de conexión entre servidor y cliente.
app.use(cors({ origin: ["http://localhost:5173"] }));

// Middleware que muestra información por consola sobre la petición entrante.
app.use(morgan("dev"));

// Middleware que parsea el JSON de un body.
app.use(express.json());

// Middleware para permitir el acceso a la carpeta de imágenes.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware que registra a un nuevo usuario.
app.post("/register", registerUser);

// Middleware que logea a un usuario existente.
app.post("/login", loginUser);

// Middleware que muestra la lista de meetups.
app.get("/meetups", listMeetups);

// Middleware que filtra las meetups
app.get("/meetups/filter", filterMeetups);

// Middleware para filtrar una meetup por ID
app.get("/meetups/:meetupId", getMeetupDetails);

// Middleware para mostrar los usuarios que asisten a una meetup.
app.get("/meetups/:meetupId/attendees", getAttendeesCount);

// Middleware para unirse a una meetup.
app.post("/meetups/:meetupId/join", validateAuth, joinMeetup);

// Middleware para abandonar una meetup.
app.delete("/meetups/:meetupId/leave", validateAuth, leaveMeetup);

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

// Middleware para crear una meetup con una imagen en form-data.
app.post("/meetup", upload.single("meetupImage"), createMeetup);

// Middleware de manejo de errores.
app.use(errorHandler);

// Middleware de ruta no encontrada.
app.use(notFoundHandler);

// Ponemos el servidor a escuchar peticiones en un puerto dado.
app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
