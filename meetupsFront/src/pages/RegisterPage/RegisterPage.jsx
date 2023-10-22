// Importamos los hooks
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

//Importamos los componentes
import RegisterForm from "../../forms/RegisterForm/RegisterForm";

const RegisterPage = () => {
  const { authUser, authRegister, loading } = useAuth();

  // Si la persona está autenticada redirigimos a la página principal.
  if (authUser) return <Navigate to="/" />;

  return (
    <main>
      <RegisterForm authRegister={authRegister} loading={loading} />
    </main>
  );
};

export default RegisterPage;
