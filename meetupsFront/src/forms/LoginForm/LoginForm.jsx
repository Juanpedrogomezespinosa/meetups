//Importamos los prop-types.
import PropTypes from "prop-types";
import { useState } from "react";

import "./LoginForm.css";

const LoginForm = ({ authLogin, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="form-container"
      onSubmit={(e) => {
        e.preventDefault();
        authLogin(email, password);
      }}
    >
      <h2 className="form-title">Login:</h2>
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

      <button disabled={loading}>Login</button>
    </form>
  );
};

LoginForm.propTypes = {
  authLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default LoginForm;
