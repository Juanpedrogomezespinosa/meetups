//Importamos los prop-types.
import PropTypes from "prop-types";
import { useState } from "react";

import "./RegisterForm.css";

const RegisterForm = ({ authRegister, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  return (
    <form
      className="register-form-container"
      onSubmit={(e) => {
        e.preventDefault();

        authRegister(email, password, repeatedPassword);
      }}
    >
      <h2 className="register-form-title"> Registro</h2>

      <label htmlFor="email">Email: </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="email">Contraseña: </label>
      <input
        type="password"
        id="pass"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength="4"
        maxLength="100"
        required
      />

      <label htmlFor="email">Repita la contraseña: </label>
      <input
        type="password"
        id="repeatedPass"
        value={repeatedPassword}
        onChange={(e) => setRepeatedPassword(e.target.value)}
        minLength="4"
        maxLength="100"
        required
      />

      <button disabled={loading}>Registrarse</button>
    </form>
  );
};

RegisterForm.propTypes = {
  authRegister: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default RegisterForm;
