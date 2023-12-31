import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../contexts/AuthContext";
import "./CreateMeetupForm.css";

const CreateMeetupForm = ({ onMeetupCreated, onClose }) => {
  const { authUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    location: "",
    date: "",
    time: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData({ ...formData, image: imageFile });
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.image) {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("theme", formData.theme);
      body.append("location", formData.location);
      body.append("date", formData.date);
      body.append("time", formData.time);
      body.append("meetupImage", formData.image);

      try {
        const response = await fetch("http://localhost:3070/meetup/", {
          method: "POST",
          body: body,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.status === "ok" && data.meetupId && data.photo_url) {
          const newMeetup = {
            id: data.meetupId,
            title: formData.title,
            description: formData.description,
            theme: formData.theme,
            location: formData.location,
            date: formData.date,
            time: formData.time,
            attendees_count: 0,
            photo_url: data.photo_url,
          };

          onMeetupCreated(newMeetup);
        } else {
          console.error("Error en la respuesta del servidor:", data.message);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }

      onClose();
    } else {
      console.log(
        "Por favor, selecciona una imagen antes de enviar el formulario."
      );
      alert("Por favor, selecciona una imagen antes de enviar el formulario.");
    }
  };

  return (
    <div className="full-container" onClick={handleClose}>
      <div
        className="form-container create-meetup-container"
        onClick={(e) => e.stopPropagation()}
      >
        {authUser ? (
          <form onSubmit={handleSubmit} className="meetup-form">
            <label className="form-label" htmlFor="image">
              Imagen:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label className="form-label" htmlFor="title">
              Título:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <label className="form-label" htmlFor="description">
              Descripción:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <label className="form-label" htmlFor="theme">
              Tema:
            </label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
            />
            <label className="form-label" htmlFor="location">
              Ubicación:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <label className="form-label" htmlFor="date">
              Fecha:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <label className="form-label" htmlFor="time">
              Hora:
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
            <button type="submit" className="form-button">
              Crear Meetup
            </button>
          </form>
        ) : (
          <p>Debes iniciar sesión para crear meetups.</p>
        )}
      </div>
    </div>
  );
};

CreateMeetupForm.propTypes = {
  onMeetupCreated: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateMeetupForm;
