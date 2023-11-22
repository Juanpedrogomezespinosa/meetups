require("dotenv").config();

const getPool = require("./getPool");

// Función que crea las tablas en la base de datos.
const createTables = async () => {
  // Tratamos de obtener un pool de conexiones.
  const pool = await getPool();

  try {
    console.log("Borrando tablas...");

    // Borrar tablas si existen
    await pool.query("DROP TABLE IF EXISTS meetup_attendees");
    await pool.query("DROP TABLE IF EXISTS meetup");
    await pool.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    // Crear tabla users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);

    // Crear tabla meetup
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meetup (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        photo_url VARCHAR(255),
        theme VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        attendees INT UNSIGNED NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla meetup_attendees
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meetup_attendees (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        meetup_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("¡Tablas creadas!");

    // Al terminar de insertar las tablas cerramos el proceso con código 0 indicando que todo ha ido bien.
    process.exit(0);
  } catch (err) {
    console.error(err);

    // Cerramos el proceso indicando que ha habido algún error con el código 1.
    process.exit(1);
  }
};

// Llamamos a la función que se encarga de crear las tablas.
createTables();
