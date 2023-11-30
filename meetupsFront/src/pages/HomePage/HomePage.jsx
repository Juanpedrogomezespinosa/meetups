import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CreateMeetupForm from "../../forms/CreateMeetupForm/CreateMeetupForm";
import { useMeetup } from "../../hooks/useMeetup";
import { AuthContext } from "../../contexts/AuthContext";
import FilterByCityAndThemeForm from "../../forms/FilterByCityAndThemeForm/FilterByCityAndThemeForm";
import { getToken } from "../../utils/getToken";

import "./HomePage.css";

const HomePage = () => {
  const { authUser } = useContext(AuthContext);
  const { meetups, addMeetup, loading } = useMeetup();
  const [formattedMeetup] = useState(null);
  const [filteredMeetups, setFilteredMeetups] = useState(null);
  const [attendeesCounts, setAttendeesCount] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [meetupMessageId, setMeetupMessageId] = useState(null);
  const [isCreateMeetupFormVisible, setCreateMeetupFormVisibility] =
    useState(false);

  const handleToggleCreateMeetupForm = () => {
    setCreateMeetupFormVisibility(!isCreateMeetupFormVisible);
  };

  useEffect(() => {
    const storedCounts = JSON.parse(localStorage.getItem("attendeesCounts"));
    if (storedCounts) {
      setAttendeesCount(storedCounts);
    }
  }, []);

  const handleMeetupsFiltered = (city, theme) => {
    fetch(`http://localhost:3070/meetups/filter?city=${city}&theme=${theme}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Error al buscar meetups filtradas");
          return [];
        }
      })
      .then((data) => {
        const meetupsWithImageUrl = data.data.map((meetup) => ({
          ...meetup,
          imageUrl: `http://localhost:3070/${meetup.photo_url}`,
        }));
        setFilteredMeetups(meetupsWithImageUrl);
      })
      .catch((error) => {
        console.error("Error de red al buscar meetups filtradas", error);
      });
  };

  const onSignUp = async (meetupId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:3070/meetups/${meetupId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al inscribirse en la meetup");
      }

      const data = await response.json();

      if (data.statusCode === 200) {
        showSuccessMessage(
          "Te has inscrito en la meetup correctamente",
          meetupId
        );

        setAttendeesCount((prevCounts) => ({
          ...prevCounts,
          [meetupId]: (prevCounts[meetupId] || 0) + 1,
        }));

        const updatedCounts = {
          ...attendeesCounts,
          [meetupId]: (attendeesCounts[meetupId] || 0) + 1,
        };
        localStorage.setItem("attendeesCounts", JSON.stringify(updatedCounts));
      } else {
        if (data.message === "Already joined") {
          showSuccessMessage("Ya estás inscrito en esta meetup", meetupId);
        } else {
          showSuccessMessage("Ya estás inscrito en esta meetup", meetupId);
        }
      }
    } catch (error) {
      console.error("Error al inscribirse en la meetup:", error);
    }
  };

  const onUnsubscribe = async (meetupId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:3070/meetups/${meetupId}/leave`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        // console.error("Error al darse de baja de la meetup");
      }

      const data = await response.json();

      if (data.status === "ok") {
        showSuccessMessage(
          "Te has dado de baja de la meetup correctamente",
          meetupId
        );

        setAttendeesCount((prevCounts) => ({
          ...prevCounts,
          [meetupId]: (prevCounts[meetupId] || 0) - 1,
        }));
      } else {
        if (data.message === "Not joined") {
          showSuccessMessage("No estás inscrito en esta meetup", meetupId);
        } else {
          showSuccessMessage("No estás inscrito en esta meetup", meetupId);
        }
      }
    } catch (error) {
      console.error("Error al darse de baja de la meetup:", error);
    }
  };

  const showSuccessMessage = (message, meetUpId) => {
    setSuccessMessage(message);
    setMeetupMessageId(meetUpId);

    setTimeout(() => {
      setSuccessMessage(null);
      setMeetupMessageId(null);
    }, 3000);
  };

  return (
    <main>
      <div className="contenedor-formularios">
        <div className="divs-formularios">
          <FilterByCityAndThemeForm
            className="filter-city-theme-form"
            onMeetupsFiltered={handleMeetupsFiltered}
            loading={loading}
          />
        </div>
        {authUser && (
          <button
            className="boton-crear"
            onClick={handleToggleCreateMeetupForm}
          >
            Crear Meetup
          </button>
        )}
      </div>

      {isCreateMeetupFormVisible && (
        <CreateMeetupForm
          onMeetupCreated={addMeetup}
          onClose={handleToggleCreateMeetupForm}
        />
      )}

      <div className="container-filtrados">
        {formattedMeetup && (
          <div className="filtered-id-meetup-container">
            <div className="filter-id-img">
              {formattedMeetup.imageUrl && (
                <img
                  src={formattedMeetup.imageUrl}
                  alt="Imagen de la meetup"
                  style={{ display: "none" }}
                />
              )}
            </div>

            <ul className="ul-filtrada-id">
              <h2 className="h2-meetups-id">Meetups Filtradas por ID:</h2>
              <li className="tarjeta-id" key={formattedMeetup.id}>
                {formattedMeetup.photo_url && (
                  <img
                    src={`http://localhost:3070/${formattedMeetup.photo_url}`}
                    alt="Imagen del meetup"
                    className="meetup-image"
                  />
                )}
                <h3>{formattedMeetup.title}</h3>
                <p className="filter-id-description">
                  {formattedMeetup.description}
                </p>
                <div className="datos-container-id">
                  <p className="datos-meetups">
                    {" "}
                    <img
                      src="./src/assets/tema.png"
                      alt="icono tema"
                      style={{ width: "40px", height: "40px" }}
                    />{" "}
                    {formattedMeetup.theme}
                  </p>
                  <p className="datos-meetups">
                    {" "}
                    <img
                      src="./src/assets/localizacion.png"
                      alt="icono localización"
                      style={{ width: "40px", height: "40px" }}
                    />{" "}
                    {formattedMeetup.location}
                  </p>
                  <p className="datos-meetups">
                    <img
                      src="./src/assets/fecha.png"
                      alt="icono fecha"
                      style={{ width: "40px", height: "40px" }}
                    />{" "}
                    {new Date(formattedMeetup.date).toLocaleDateString("en-GB")}
                  </p>
                  <p className="datos-meetups">
                    <img
                      src="./src/assets/hora.png"
                      alt="icono hora"
                      style={{ width: "40px", height: "40px" }}
                    />{" "}
                    {new Date(
                      `1970-01-01T${formattedMeetup.time}`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="datos-meetups">
                    <img
                      src="./src/assets/asistentes.png"
                      alt="icono asistentes"
                      style={{ width: "40px", height: "40px" }}
                    />{" "}
                    {formattedMeetup.attendees || 0}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}
        {filteredMeetups && filteredMeetups.length > 0 ? (
          <div className="filter-city-theme-form">
            <ul className="meetups-list">
              {filteredMeetups.map((meetup) => (
                <li className="tarjeta-id" key={meetup.id}>
                  {meetup.imageUrl ? (
                    <img
                      src={`http://localhost:3070/${meetup.photo_url}`}
                      alt="Imagen del meetup"
                      className="meetup-image"
                    />
                  ) : (
                    <p>Imagen no disponible</p>
                  )}
                  <h3>{meetup.title}</h3>
                  <p className="filter-city-theme-description">
                    {meetup.description}
                  </p>
                  <div className="datos-container-city-theme">
                    <p className="datos-meetups">
                      <img
                        src="./src/assets/tema.png"
                        alt="icono tema"
                        style={{ width: "40px", height: "40px" }}
                      />{" "}
                      {meetup.theme}
                    </p>
                    <p className="datos-meetups">
                      <img
                        src="./src/assets/localizacion.png"
                        alt="icono localización"
                        style={{ width: "40px", height: "40px" }}
                      />{" "}
                      {meetup.location}
                    </p>
                    <p className="datos-meetups">
                      <img
                        src="./src/assets/fecha.png"
                        alt="icono fecha"
                        style={{ width: "40px", height: "40px" }}
                      />{" "}
                      {new Date(meetup.date).toLocaleDateString("en-GB")}
                    </p>
                    <p className="datos-meetups">
                      <img
                        src="./src/assets/hora.png"
                        alt="icono hora"
                        style={{ width: "40px", height: "40px" }}
                      />{" "}
                      {new Date(`1970-01-01T${meetup.time}`).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                    </p>
                    <p className="datos-meetups">
                      <img
                        src="./src/assets/asistentes.png"
                        alt="icono asistentes"
                        style={{ width: "40px", height: "40px" }}
                      />{" "}
                      {meetup.attendees_count || 0}
                    </p>{" "}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <ul className="meetups-list">
        {meetups?.length > 0 ? (
          meetups.map((meetup, index) => (
            <li key={index}>
              {meetup && meetup.photo_url !== undefined ? (
                <img
                  src={`http://localhost:3070/${meetup.photo_url}`}
                  alt="Imagen del meetup"
                  className="meetup-image"
                />
              ) : (
                <p>Imagen no disponible</p>
              )}

              <h3>{meetup && meetup.title}</h3>
              <p className="meetups-list-description">
                {meetup && meetup.description}
              </p>

              <div className="datos-container">
                <p className="datos-meetups">
                  <img
                    src="./src/assets/tema.png"
                    alt="icono tema"
                    style={{ width: "40px", height: "40px" }}
                  />{" "}
                  {meetup && meetup.theme}
                </p>
                <p className="datos-meetups">
                  <img
                    src="./src/assets/localizacion.png"
                    alt="icono localización"
                    style={{ width: "40px", height: "40px" }}
                  />{" "}
                  {meetup && meetup.location}
                </p>
                <p className="datos-meetups">
                  <img
                    src="./src/assets/fecha.png"
                    alt="icono fecha"
                    style={{ width: "40px", height: "40px" }}
                  />{" "}
                  {new Date(meetup && meetup.date).toLocaleDateString("en-GB")}
                </p>
                <p className="datos-meetups">
                  <img
                    src="./src/assets/hora.png"
                    alt="icono hora"
                    style={{ width: "40px", height: "40px" }}
                  />{" "}
                  {new Date(
                    `1970-01-01T${meetup && meetup.time}`
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p className="datos-meetups">
                  <img
                    src="./src/assets/asistentes.png"
                    alt="icono asistentes"
                    style={{ width: "40px", height: "40px" }}
                  />{" "}
                  {attendeesCounts[meetup && meetup.id] || 0}
                </p>
              </div>
              {authUser && (
                <div className="botonera">
                  <button onClick={() => onSignUp(meetup && meetup.id)}>
                    Inscribirse
                  </button>
                  <button onClick={() => onUnsubscribe(meetup && meetup.id)}>
                    Darse de baja
                  </button>
                </div>
              )}
              {successMessage && meetupMessageId === meetup.id && (
                <div className="success-message">{successMessage}</div>
              )}
            </li>
          ))
        ) : (
          <li className="no-meetups">
            <p>No se encontraron meetups.</p>
          </li>
        )}
      </ul>
    </main>
  );
};

HomePage.propTypes = {
  onMeetupCreated: PropTypes.func.isRequired,
};

export default HomePage;
