// URL base del API.
const baseURL = import.meta.env.VITE_API_URL;

// importamos la función que retorna el token.
import { getToken } from "../utils/getToken";

// Creación de meetup
export const createMeetupService = async (formData) => {
  const token = getToken();

  const res = await fetch(`${baseURL}/meetup`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      formData,
    }),
  });

  const body = await res.json();

  return body;
};

// Listado de meetups
export const listMeetupService = async (searchParams) => {
  const token = getToken();

  const res = await fetch(`${baseURL}/meetups?${searchParams}`, {
    headers: token ? { Authorization: token } : {},
  });

  const body = await res.json();

  return body;
};

// Detalles de meetups
export const getMeetupDetailsService = async (meetupId) => {
  const token = getToken();

  const res = await fetch(`${baseURL}/meetup/${meetupId}`, {
    headers: token ? { Authorization: token } : {},
  });

  const body = await res.json();

  return body;
};

// Filtrado de meetups
export const filterMeetupsService = async (city, theme) => {
  const token = getToken();

  const res = await fetch(
    `${baseURL}/meetups/filter?city=${city}&theme=${theme}`,
    {
      headers: token ? { Authorization: token } : {},
    }
  );

  const body = await res.json();

  return body;
};
