// Autores de la Comisión 1: Jeremías Bontorno, Nicolas Hassan, Axel Mejias, Valentino Vernier, Luciano Mas y Leandro Nuñez.
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ListaPage from "./pages/ListaPage";
import FormularioPage from "./pages/FormularioPage";
import EditarPage from "./pages/EditarPage";
import LoginPage from "./pages/LoginPage";
import PublicaPage from "./pages/PublicaPage";
import MenuPage from "./pages/MenuPage";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/publica" element={<PublicaPage />} />
        <Route path="/menu_inicio" element={<PrivateRoute><MenuPage /></PrivateRoute>} />
        <Route path="/lista" element={<PrivateRoute><ListaPage /></PrivateRoute>} />
        <Route path="/nuevo" element={<PrivateRoute rol="ADMIN"><FormularioPage /></PrivateRoute>} />
        <Route path="/editar/:id" element={<PrivateRoute rol="ADMIN"><EditarPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
