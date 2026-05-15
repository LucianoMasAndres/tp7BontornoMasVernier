import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Formulario from "../components/Formulario";
import { useParticipantes } from "../context/ParticipantesContext";

export default function FormularioPage() {
  const navigate = useNavigate();
  const { seleccionarParaEditar } = useParticipantes();

  useEffect(() => {
    seleccionarParaEditar(null);
  }, [seleccionarParaEditar]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Participante</h2>
      <Formulario onSuccess={() => navigate("/lista")} />
    </div>
  );
}
