// Importamos los componentes.
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Route, Routes } from "react-router-dom";

// Imporamos las páginas
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

const App = () => {
  const handleMeetupCreated = (meetup) => {
    async function saveMeetupOnServer(meetup) {
      try {
        const response = await fetch("/api/meetup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meetup),
        });

        if (response.ok) {
          // Meetup guardado con éxito en el servidor
        } else {
          console.error("Error al crear el meetup");
        }
      } catch (error) {
        console.error("Error al crear el meetup:", error);
      }
    }

    saveMeetupOnServer(meetup);
  };

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={<HomePage onMeetupCreated={handleMeetupCreated} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
