import PropTypes from "prop-types";
import { TOKEN_LOCAL_STORAGE_KEY } from "../utils/constants";
import { createContext, useEffect, useState } from "react";
import { signInService, signUpService } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseUserFromToken = (token) => {
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const user = {
        id: tokenData.sub,
        username: tokenData.username,
      };
      return user;
    } catch (error) {
      console.error("Error al analizar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);

    if (token) {
      const userFromToken = parseUserFromToken(token);
      setAuthUser(userFromToken);
    }

    setLoading(false);
  }, []);

  const authRegister = async (email, password, repeatedPassword) => {
    try {
      setLoading(true);
      if (password !== repeatedPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      await signUpService(email, password);

      // Redirige al usuario a la página de inicio de sesión después del registro.
      goToLoginPage();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authLogin = async (email, password) => {
    try {
      setLoading(true);

      const body = await signInService(email, password);
      localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, body.data.token);

      const userFromToken = parseUserFromToken(body.data.token);
      setAuthUser(userFromToken);

      // Redirige al usuario a la página principal después de iniciar sesión.
      goToHomePage();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authLogout = () => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
    setAuthUser(null);

    // Redirige al usuario a la página de inicio después de cerrar sesión.
    goToHomePage();
  };

  // Función para redirigir al usuario a la página de inicio de sesión
  const goToLoginPage = () => {
    navigate("/login");
  };

  // Función para redirigir al usuario a la página principal
  const goToHomePage = () => {
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authRegister,
        authLogin,
        authLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
