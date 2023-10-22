# Meetup App

La aplicación Meetup es una plataforma para crear y gestionar eventos y meetups. Permite a los usuarios crear, buscar y unirse a meetups sobre diversos temas y en diferentes ubicaciones.

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión de usuarios.
- Creación de nuevos meetups.
- Listado de meetups disponibles.
- Filtrado de meetups por ciudad y temática.
- Detalles de un meetup, incluido el número de asistentes.
- Inscripción en un meetup.
- Darse de baja de un meetup.

## Requisitos

- Node.js
- MySQL
- npm (Administrador de paquetes de Node.js)

## Configuración

1. Clona este repositorio en tu máquina local:

- git clone https://github.com/Juanpedrogomezespinosa/meetupsBack

2. Ve al directorio de tu proyecto:

- cd nombre-carpeta

3. Configura la base de datos:

- Crea una base de datos MySQL llamada "meetup".
- Importa el esquema de la base de datos desde el archivo "schema.sql".

4. Instala Node.js y demás dependencias necesarias:

- Escribe en la terminal el comando "npm install" para instalar node y todas las dependencias necesarias.

4. Configura las variables de entorno:

- Crea un archivo ".env" en la raíz del proyecto y define las siguientes variables:

· DB_HOST=localhost
· DB_USER=tu-usuario
· DB_PASSWORD=tu-contraseña
· DB_DATABASE=meetup
· SECRET_KEY=your-secret-key

5. Inicia la aplicación:

- node server.js

6. La aplicación estará disponible en http://localhost:3070.

Uso

· Regístrate como usuario en la aplicación.
· Inicia sesión con tu cuenta.
· Explora los meetups disponibles o crea uno nuevo.
· Únete a los meetups que te interesen.
· Accede a los detalles de un meetup para ver el número de asistentes.
· Disfruta de la comunidad de meetups.
