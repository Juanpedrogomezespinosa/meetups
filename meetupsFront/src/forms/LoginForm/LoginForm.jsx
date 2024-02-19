//Importamos los prop-types.
import PropTypes from "prop-types";
import { useState } from "react";

import "./LoginForm.css";

const LoginForm = ({ authLogin, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-body">
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

        <label htmlFor="password">Contraseña: </label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="4"
            maxLength="100"
            required
          />
          <button
            type="button"
            className=" emoticon-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="emoticon">{showPassword ? "🙈" : "🙉"}</span>
          </button>
        </div>

        <button disabled={loading}>Login</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  authLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default LoginForm;
