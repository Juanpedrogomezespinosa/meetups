// Importamos los hooks
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Importamos los estilos
import "./Header.css";

// Importamos los iconos.
import loginIcon from "../../assets/login.png";
import registerIcon from "../../assets/register.png";
import titulo from "../../assets/titulo.png";
import logoutIcon from "../../assets/logout.svg";

const Header = () => {
  const { authUser, authLogout } = useAuth();

  return (
    <header>
      <h1>
        <NavLink to="/">
          <img src={titulo} alt="Titulo" className="titulo" />
        </NavLink>
      </h1>
      <nav>
        {authUser && <span>{authUser.email}</span>}
        {!authUser && (
          <>
            <div>
              <NavLink to="/login">
                <img className="login-icon" src={loginIcon} alt="Login icon" />
              </NavLink>
            </div>
            <div>
              <NavLink to="/register">
                <img
                  className="register-icon"
                  src={registerIcon}
                  alt="register icon"
                />
              </NavLink>
            </div>
          </>
        )}

        {authUser && (
          <>
            <button className="logout-icon" onClick={() => authLogout()}>
              <img
                className="logout-icon-image"
                src={logoutIcon}
                alt="logout icon"
              />
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
