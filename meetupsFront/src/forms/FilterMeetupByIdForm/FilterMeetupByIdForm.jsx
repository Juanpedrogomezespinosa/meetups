import PropTypes from "prop-types";
import { useState } from "react";

import "./FilterMeetupByIdForm.css";

const FilterMeetupByIdForm = ({ onMeetupDetails, loading }) => {
  const [meetupId, setMeetupId] = useState("");

  const handleSearch = async () => {
    if (meetupId == null) return;
    onMeetupDetails(meetupId);
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
          className="imagen-boton"
          src="./src/assets/buscar.svg"
          alt="Crear Meetup"
          style={{ width: "20px", height: "20px" }}
        />
      </button>
    </div>
  );
};

FilterMeetupByIdForm.propTypes = {
  onMeetupDetails: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FilterMeetupByIdForm;
