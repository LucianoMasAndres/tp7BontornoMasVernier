import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MenuPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paginas / Menú</h2>
      <Link
        to="/lista"
        className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded text-center text-lg transition"
      >
        Lista de Participantes
      </Link>
      {user?.rol === "ADMIN" && (
        <Link
          to="/nuevo"
          className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded text-center text-lg transition"
        >
          Nuevo participante
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded text-center text-lg transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
