// Importamos los hooks.
import { useEffect, useState } from "react";

// Importamos los servicios.
import { listMeetupService } from "../services/meetupService";
import { useSearchParams } from "react-router-dom";

export const useMeetup = () => {
  const [meetups, setMeetups] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const addMeetup = (meetup) => {
    setMeetups([...meetups, meetup]);
  };

  useEffect(() => {
    // Realizamos una petición para obtener los meetups.
    const fetchMeetups = async () => {
      try {
        setLoading(true);

        const body = await listMeetupService(searchParams);

        setMeetups(body.data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    // LLamamos a la función anterior
    fetchMeetups();
  }, [searchParams]);

  return {
    meetups,
    setSearchParams,
    loading,
    addMeetup,
  };
};
