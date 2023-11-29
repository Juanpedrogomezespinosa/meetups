import PropTypes from "prop-types";
import { useState } from "react";

import "./FilterMeetupByIdForm.css";

const FilterMeetupByIdForm = ({ onMeetupDetails, loading }) => {
  const [meetupId, setMeetupId] = useState("");
  const [meetupImage, setMeetupImage] = useState("");
  const [formattedMeetup, setFormattedMeetup] = useState(null);
  const [attendees, setAttendees] = useState(0);

  // Función para obtener el número de asistentes
  const fetchAttendees = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3070/meetups/${id}/attendees`
      );
      if (response.ok) {
        const data = await response.json();
        setAttendees(data.attendees);
      } else {
        console.error("Error al obtener el número de asistentes");
      }
    } catch (error) {
      console.error("Error de red al obtener el número de asistentes", error);
    }
  };

  const handleSearch = async () => {
    if (meetupId) {
      try {
        const response = await fetch(
          `http://localhost:3070/meetups/${meetupId}`
        );
        if (response.ok) {
          const data = await response.json();

          const formattedMeetup = {
            id: data.data.id,
            photo_url: data.data.photo_url,
            title: data.data.title,
            description: data.data.description,
            theme: data.data.theme,
            location: data.data.location,
            date: data.data.date,
            time: data.data.time,
          };

          // Obtenemos el número de asistentes
          fetchAttendees(formattedMeetup.id);

          onMeetupDetails(formattedMeetup);

          if (data.data.photo_url) {
            setMeetupImage(`http://localhost:3070/${data.data.photo_url}`);
          }
          setFormattedMeetup(formattedMeetup);
        } else {
          console.error("Error al buscar la meetup por ID");
        }
      } catch (error) {
        console.error("Error de red al buscar la meetup por ID", error);
      }
    }
  };

  return (
    <div className="filter-meetup-form-container">
      <input
        type="number"
        value={meetupId}
        onChange={(e) => setMeetupId(e.target.value)}
        placeholder="ID de la Meetup"
      />
      <button onClick={handleSearch} disabled={loading}>
        <img
          src="./src/assets/buscar.png"
          alt="Crear Meetup"
          style={{ width: "40px", height: "40px" }}
        />
      </button>
      {formattedMeetup && (
        <div className="filtered-id-meetup-container">
          <div className="filter-id-img">
            {meetupImage && (
              <img
                src={meetupImage}
                alt="Imagen de la meetup"
                style={{ display: "none" }}
              />
            )}
          </div>
          <ul>
            <li className="meetups-list" key={formattedMeetup.id}>
              <h2>Meetups Filtradas por ID:</h2>
              {formattedMeetup.photo_url && (
                <img
                  src={`http://localhost:3070/${formattedMeetup.photo_url}`}
                  alt="Imagen del meetup"
                  className="meetup-image"
                />
              )}
              <h3>Titulo: {formattedMeetup.title}</h3>
              <p className="filter-id-description">
                Descripción: {formattedMeetup.description}
              </p>
              <p>Tema: {formattedMeetup.theme}</p>
              <p>Localización: {formattedMeetup.location}</p>
              <p>
                Fecha:{" "}
                {new Date(formattedMeetup.date).toLocaleDateString("en-GB")}
              </p>
              <p>
                Hora:{" "}
                {new Date(
                  `1970-01-01T${formattedMeetup.time}`
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
              <p>Asistentes: {attendees || 0}</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

FilterMeetupByIdForm.propTypes = {
  onMeetupDetails: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FilterMeetupByIdForm;
