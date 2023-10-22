import CreateMeetupForm from "../../forms/CreateMeetupForm/CreateMeetupForm";
import { useMeetup } from "../../hooks/useMeetup";
import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import FilterMeetupByIdForm from "../../forms/FilterMeetupByIdForm/FilterMeetupByIdForm";
import FilterByCityAndThemeForm from "../../forms/FilterByCityAndThemeForm/FilterByCityAndThemeForm";
import { AuthContext } from "../../contexts/AuthContext";
import MeetupDetails from "../../components/MeetupsDetails/MeetupsDetails";
import { getToken } from "../../utils/getToken";

import "./HomePage.css";

const HomePage = () => {
  const { authUser } = useContext(AuthContext);
  const { meetups, addMeetup, setSearchParams, loading } = useMeetup();
  const [meetupDetails, setMeetupDetails] = useState(null);
  const [filteredMeetups, setFilteredMeetups] = useState(null);
  const [attendeesCounts, setAttendeesCount] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const storedCounts = JSON.parse(localStorage.getItem("attendeesCounts"));
    if (storedCounts) {
      setAttendeesCount(storedCounts);
    }
  }, []);

  const handleMeetupDetails = () => {
    setMeetupDetails(meetupDetails);
  };

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
        setFilteredMeetups(data.data);
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
        showSuccessMessage("Te has inscrito en la meetup correctamente");

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
          showSuccessMessage("Ya estás inscrito en esta meetup");
        } else {
          showSuccessMessage("Ya estás inscrito en la meetup");
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
          method: "POST",
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
        showSuccessMessage("Te has dado de baja de la meetup correctamente");

        setAttendeesCount((prevCounts) => ({
          ...prevCounts,
          [meetupId]: (prevCounts[meetupId] || 0) - 1,
        }));
      } else {
        if (data.message === "Not joined") {
          showSuccessMessage("No estás inscrito en esta meetup");
        } else {
          showSuccessMessage("No estás inscrito en esta meetup");
        }
      }
    } catch (error) {
      console.error("Error al darse de baja de la meetup:", error);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <main>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <FilterMeetupByIdForm
        className="filter-meetup-form"
        setSearchParams={setSearchParams}
        onMeetupDetails={handleMeetupDetails}
        loading={loading}
      />
      <FilterByCityAndThemeForm
        className="filter-city-theme-form"
        onMeetupsFiltered={handleMeetupsFiltered}
        loading={loading}
      />
      {authUser && <CreateMeetupForm onMeetupCreated={addMeetup} />}

      {meetupDetails ? (
        <MeetupDetails
          meetup={meetupDetails}
          user={authUser}
          onSignUp={onSignUp}
          onUnsubscribe={onUnsubscribe}
        />
      ) : null}

      <div>
        {filteredMeetups ? (
          <div className="filter-city-theme-form">
            <ul className="meetups-list">
              <h2>Meetups filtradas por ciudad y tema: </h2>
              {filteredMeetups.map((meetup) => (
                <li key={meetup.id}>
                  {meetup.photo_url && (
                    <img
                      src={`http://localhost:3070/${meetup.photo_url}`}
                      alt="Imagen del meetup"
                      className="meetup-image"
                    />
                  )}
                  <h3>{meetup.title}</h3>
                  <p>{meetup.description}</p>
                  <p>Tema: {meetup.theme}</p>
                  <p>Localización: {meetup.location}</p>
                  <p>
                    Fecha: {new Date(meetup.date).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    Hora:{" "}
                    {new Date(`1970-01-01T${meetup.time}`).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </p>
                  <p>Asistentes: {meetup.attendees}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <ul className="meetups-list">
        {meetups?.length > 0 ? (
          meetups.map((meetup) => (
            <li key={meetup.id}>
              {meetup.photo_url && (
                <img
                  src={`http://localhost:3070/${meetup.photo_url}`}
                  alt="Imagen del meetup"
                  className="meetup-image"
                />
              )}
              <h3>{meetup.title}</h3>
              <p>{meetup.description}</p>
              <p>Tema: {meetup.theme}</p>
              <p>Localización: {meetup.location}</p>
              <p>Fecha: {new Date(meetup.date).toLocaleDateString("en-GB")}</p>
              <p>
                Hora:{" "}
                {new Date(`1970-01-01T${meetup.time}`).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </p>
              <p>Asistentes: {attendeesCounts[meetup.id] || 0}</p>
              {authUser && (
                <div>
                  <button onClick={() => onSignUp(meetup.id)}>
                    Inscribirse
                  </button>
                  <button onClick={() => onUnsubscribe(meetup.id)}>
                    Darse de baja
                  </button>
                </div>
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
