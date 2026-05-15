import { useState } from "react";
import { Link } from "react-router-dom";
import Filtros, { type FiltrosState } from "../components/Filtros";
import ParticipanteCard from "../components/ParticipanteCard";
import { useParticipantes } from "../context/ParticipantesContext";
import { useAuth } from "../context/AuthContext";

export default function ListaPage() {
  const { participantes } = useParticipantes();
  const { user } = useAuth();

  const [filtros, setFiltros] = useState<FiltrosState>({
    buscar: "",
    modalidad: "Todas",
    nivel: "Todos",
  });

  const handleLimpiarFiltros = () => {
    setFiltros({ buscar: "", modalidad: "Todas", nivel: "Todos" });
  };

  const filtrados = participantes.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(filtros.buscar.toLowerCase());
    const matchModalidad = filtros.modalidad === "Todas" || p.modalidad === filtros.modalidad;
    const matchNivel = filtros.nivel === "Todos" || p.nivel === filtros.nivel;
    return matchNombre && matchModalidad && matchNivel;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded shadow">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lista de Participantes</h2>
          <p className="text-gray-500 text-sm mt-1">
            Mostrando {filtrados.length} de {participantes.length} participantes
          </p>
        </div>
        {user?.rol === "ADMIN" && (
          <div className="mt-4 md:mt-0">
            <Link
              to="/nuevo"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              + Agregar Participante
            </Link>
          </div>
        )}
      </div>

      <Filtros
        filtros={filtros}
        setFiltros={setFiltros}
        onLimpiar={handleLimpiarFiltros}
      />

      {filtrados.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">
          No hay participantes
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((p) => (
            <ParticipanteCard key={p.id} participante={p} />
          ))}
        </div>
      )}
    </div>
  );
}
