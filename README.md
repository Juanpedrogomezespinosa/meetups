# meetupsBack README.MD

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

### Requisitos

- Node.js
- MySQL
- npm (Administrador de paquetes de Node.js)

#### Configuración

1. Clona este repositorio en tu máquina local:

- git clone https://github.com/Juanpedrogomezespinosa/meetups

2. Ve al directorio de tu proyecto:

- cd nombre-carpeta

3. Configura la base de datos:

- Crea una base de datos MySQL llamada "meetup".
- ejecuta el fichero "initDb.js" mediante el siguiente comando: node db/initDb.js para crear las tablas necesarias en la base de datos anteriormente creada.

4. Instala Node.js y demás dependencias necesarias:

- npm install

5. Configura las variables de entorno:

- Crea un archivo ".env" en la raíz del proyecto y define las siguientes variables:

· DB_HOST=localhost
· DB_USER=tu-usuario
· DB_PASSWORD=tu-contraseña
· DB_DATABASE=meetup
· SECRET_KEY=your-secret-key

6. Inicia la aplicación:

- node server.js

7. La aplicación estará disponible en http://localhost:3070.

# meetupsFront README.MD

## Contenido

- Instalación.
- Uso.
- Dependencias.
- Contribución.
- Licencia.

## Instalación

Sigue estos pasos para instalar y ejecutar el cliente en tu entorno local:

1. Asegúrate de que tengas Node.js y npm instalados en tu sistema. Si no los tienes, puedes descargarlos desde Node.js.

2. Clona este repositorio en tu máquina local utilizando el siguiente comando:

- git clone https://github.com/Juanpedrogomezespinosa/meetups

3. Navega a la carpeta del cliente:

- cd meetupFront

4. Instala las dependencias del proyecto:

- npm install

4. inicia el servidor de desarrollo:

- npm run dev

· DB_HOST=localhost
· DB_USER=tu-usuario
· DB_PASSWORD=tu-contraseña
· DB_DATABASE=meetup
· SECRET_KEY=your-secret-key

### Uso

Una vez que la aplicación esté en funcionamiento, puedes hacer lo siguiente:

· Iniciar sesión o registrarte para acceder a las funcionalidades.
· Crear nuevos meetups proporcionando información como el título, la ubicación y el tema.
· Listar todos los meetups disponibles.
· Filtrar meetups por ID, ubicación o tema.

¡Explora y disfruta de la aplicación de Meetups!

#### Dependencias

Este proyecto utiliza las siguientes dependencias principales:

· React: Una biblioteca JavaScript para construir interfaces de usuario.
· React Router: Una biblioteca de enrutamiento para aplicaciones React.
· Vite: Un entorno de desarrollo rápido para aplicaciones web.

Puedes encontrar la lista completa de dependencias en el archivo package.json.
