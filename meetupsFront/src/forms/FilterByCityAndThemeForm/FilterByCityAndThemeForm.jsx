import PropTypes from "prop-types";
import { useState } from "react";

import "./FilterByCityAndThemeForm.css";

const FilterByCityAndThemeForm = ({ onMeetupsFiltered, loading }) => {
  const [city, setCity] = useState("");
  const [theme, setTheme] = useState("");

  const handleSearch = () => {
    // Filtrar si al menos uno de los campos tiene contenido
    if (city.trim() || theme.trim()) {
      onMeetupsFiltered(city.trim(), theme.trim());
    }
  };

  return (
    <div className="filter-form-container">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ciudad"
      />
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Tema"
      />
      <button onClick={handleSearch} disabled={loading}>
        <img
          className="imagen-boton"
          src="./src/assets/buscar.svg"
          alt="Crear Meetup"
          style={{ width: "20px", height: "20px" }}
        />
      </button>
    </div>
  );
};

FilterByCityAndThemeForm.propTypes = {
  onMeetupsFiltered: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FilterByCityAndThemeForm;
