import { useState, useEffect, FormEvent } from "react";
import { Participante } from "../models/Participante";
import { useParticipantes } from "../context/ParticipantesContext";

const TECNOLOGIAS = ["React", "Angular", "Vue", "Node", "Python", "Java"];
const PAISES = ["Argentina", "Chile", "Uruguay", "México", "España"];
const NIVELES = ["Principiante", "Intermedio", "Avanzado"];
const MODALIDADES = ["Presencial", "Virtual", "Híbrido"];

const initialForm = {
  nombre: "",
  email: "",
  edad: "",
  pais: "Argentina",
  modalidad: "Presencial",
  tecnologias: [] as string[],
  nivel: "Principiante",
  aceptaTerminos: false,
};

interface FormularioProps {
  onSuccess?: () => void;
}

export default function Formulario({ onSuccess }: FormularioProps) {
  const { agregar, editar, participanteEditando, seleccionarParaEditar } = useParticipantes();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (participanteEditando) {
      setForm({
        nombre: participanteEditando.nombre,
        email: participanteEditando.email,
        edad: participanteEditando.edad.toString(),
        pais: participanteEditando.pais,
        modalidad: participanteEditando.modalidad,
        tecnologias: participanteEditando.tecnologias,
        nivel: participanteEditando.nivel,
        aceptaTerminos: participanteEditando.aceptaTerminos,
      });
      setError("");
    } else {
      setForm(initialForm);
    }
  }, [participanteEditando]);

  const handleTecnologia = (tec: string) => {
    setForm((prev) => ({
      ...prev,
      tecnologias: prev.tecnologias.includes(tec)
        ? prev.tecnologias.filter((t) => t !== tec)
        : [...prev.tecnologias, tec],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.edad) {
      setError("Por favor completá nombre, email y edad.");
      return;
    }
    if (!form.aceptaTerminos) {
      setError("Debés aceptar los términos y condiciones.");
      return;
    }
    setError("");
    const nuevo = new Participante(
      form.nombre,
      form.email,
      Number(form.edad),
      form.pais,
      form.modalidad,
      form.tecnologias,
      form.nivel,
      form.aceptaTerminos
    );

    if (participanteEditando && participanteEditando.id) {
      editar(participanteEditando.id, nuevo);
    } else {
      agregar(nuevo);
    }
    setForm(initialForm);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleCancelar = () => {
    setForm(initialForm);
    setError("");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        />

        <input
          type="number"
          placeholder="Edad"
          value={form.edad}
          onChange={(e) => setForm((prev) => ({ ...prev, edad: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        />

        <select
          value={form.pais}
          onChange={(e) => setForm((prev) => ({ ...prev, pais: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          {PAISES.map((p) => <option key={p}>{p}</option>)}
        </select>

        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-green-700 mb-1">Modalidad</p>
          <div className="flex gap-4">
            {MODALIDADES.map((m) => (
              <label key={m} className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="modalidad"
                  value={m}
                  checked={form.modalidad === m}
                  onChange={() => setForm((prev) => ({ ...prev, modalidad: m }))}
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-green-700 mb-1">Tecnologías</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TECNOLOGIAS.map((tec) => (
              <label key={tec} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.tecnologias.includes(tec)}
                  onChange={() => handleTecnologia(tec)}
                />
                {tec}
              </label>
            ))}
          </div>
        </div>

        <select
          value={form.nivel}
          onChange={(e) => setForm((prev) => ({ ...prev, nivel: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          {NIVELES.map((n) => <option key={n}>{n}</option>)}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terminos"
            checked={form.aceptaTerminos}
            onChange={(e) => setForm((prev) => ({ ...prev, aceptaTerminos: e.target.checked }))}
          />
          <label htmlFor="terminos" className="text-sm cursor-pointer">
            Acepto los términos y condiciones del evento
          </label>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className={`${
            participanteEditando ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded transition text-sm font-semibold`}
        >
          {participanteEditando ? "Actualizar" : "Registrar"}
        </button>
        {participanteEditando && (
          <button
            type="button"
            onClick={handleCancelar}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition text-sm font-semibold"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
