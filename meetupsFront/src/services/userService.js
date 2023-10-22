// URL base del API.
const baseURL = import.meta.env.VITE_API_URL;

// importamos la función que retorna el token.
import { getToken } from "../utils/getToken";

// Registro de usuario.
export const signUpService = async (email, password) => {
  const res = await fetch(`${baseURL}/register`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const body = await res.json();
  return body;
};

// Login de usuario.

export const signInService = async (email, password) => {
  const res = await fetch(`${baseURL}/login`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const body = await res.json();

  return body;
};

// Obtener el perfil privado de un usuario.
export const getPrivateProfileService = async () => {
  const token = getToken();
  const res = await fetch(`${baseURL}/login`, {
    headers: {
      Authorization: token,
    },
  });

  const body = await res.json();

  return body;
};

// Creación de meetup.
export const createMeetupService = async (
  title,
  description,
  theme,
  location,
  date,
  time
) => {
  const token = getToken();
  const res = await fetch(`${baseURL}/register`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      title,
      description,
      theme,
      location,
      date,
      time,
    }),
  });

  const body = await res.json();

  return body;
};

// Inscripción de meetup.
export const joinMeetupService = async (meetupId, method) => {
  const token = getToken();

  const res = await fetch(`${baseURL}/meetups?${meetupId}/join`, {
    method,
    headers: {
      Authorization: token,
    },
  });

  const body = await res.json();

  return body;
};

// Darse de baja de un meetup.
export const leaveMeetupService = async (meetupId) => {
  const token = getToken();

  const res = await fetch(`${baseURL}/meetups?${meetupId}/leave`, {
    method: "delete",
    headers: {
      Authorization: token,
    },
  });

  const body = await res.json();

  return body;
};
