import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../contexts/AuthContext";

import "./CreateMeetupForm.css";

const CreateMeetupForm = ({ onMeetupCreated }) => {
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

  const handleSubmit = (e) => {
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

      fetch("http://localhost:3070/meetup/", {
        method: "POST",
        body: body,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            onMeetupCreated(data.meetup);
          } else {
            console.error("Error al subir el meetup al servidor.");
          }
        });
    } else {
      alert("Por favor, selecciona una imagen antes de enviar el formulario.");
    }
  };

  return (
    <div className="create-meetup-container">
      {authUser ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="image">Imagen:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <label htmlFor="theme">Tema:</label>
          <input
            type="text"
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
          />
          <label htmlFor="location">Ubicación:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <label htmlFor="time">Hora:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
          <button type="submit">Crear Meetup</button>
        </form>
      ) : (
        <p>Debes iniciar sesión para crear meetups.</p>
      )}
    </div>
  );
};

CreateMeetupForm.propTypes = {
  onMeetupCreated: PropTypes.func.isRequired,
};

export default CreateMeetupForm;
