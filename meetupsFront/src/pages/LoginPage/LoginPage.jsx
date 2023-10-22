// Importamos los hooks
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

//Importamos los componentes
import LoginForm from "../../forms/LoginForm/LoginForm";

const LoginPage = () => {
  const { authUser, authLogin, loading } = useAuth();

  // Si la persona está autenticada redirigimos a la página principal.
  if (authUser) return <Navigate to="/" />;

  return (
    <main>
      <LoginForm authLogin={authLogin} loading={loading} />
    </main>
  );
};

export default LoginPage;
