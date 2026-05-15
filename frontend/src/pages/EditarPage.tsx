import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Formulario from "../components/Formulario";
import { useParticipantes } from "../context/ParticipantesContext";

export default function EditarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { participantes, seleccionarParaEditar } = useParticipantes();

  useEffect(() => {
    if (id && participantes.length > 0) {
      const participante = participantes.find((p) => p.id?.toString() === id);
      if (participante) {
        seleccionarParaEditar(participante);
      } else {
        navigate("/");
      }
    }
    return () => {
      seleccionarParaEditar(null);
    };
  }, [id, participantes, seleccionarParaEditar, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Participante</h2>
      <Formulario onSuccess={() => navigate("/lista")} />
    </div>
  );
}
