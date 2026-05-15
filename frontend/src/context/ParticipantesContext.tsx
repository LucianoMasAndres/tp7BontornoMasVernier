import { createContext, useReducer, useEffect, useContext, useCallback, type ReactNode } from "react";
import axios from "axios";
import { Participante } from "../models/Participante";
import { participantesReducer, initialState } from "../reducers/participantesReducer";

interface ContextType {
  participantes: Participante[];
  participanteEditando: Participante | null;
  agregar: (p: Participante) => void;
  eliminar: (id: number) => void;
  resetear: () => void;
  editar: (id: number, p: Participante) => void;
  seleccionarParaEditar: (p: Participante | null) => void;
}

export const ParticipantesContext = createContext<ContextType | undefined>(undefined);

const API_URL = "http://localhost:8000/participantes";

function getAuthHeaders() {
  const stored = localStorage.getItem("auth_user");
  const user = stored ? JSON.parse(stored) : null;
  return user ? { Authorization: `Bearer ${user.token}` } : {};
}

export function ParticipantesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(participantesReducer, initialState);

  const fetchParticipantes = async () => {
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeaders() });
      dispatch({ type: "GET_PARTICIPANTES", payload: response.data });
    } catch (error) {
      console.error("Error al obtener participantes", error);
    }
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const agregar = useCallback(async (p: Participante) => {
    try {
      const response = await axios.post(API_URL, p, { headers: getAuthHeaders() });
      dispatch({ type: "AGREGAR", payload: response.data });
    } catch (error) {
      console.error("Error al agregar participante", error);
    }
  }, []);

  const editar = useCallback(async (id: number, p: Participante) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, p, { headers: getAuthHeaders() });
      dispatch({ type: "EDITAR", payload: response.data });
    } catch (error) {
      console.error("Error al editar participante", error);
    }
  }, []);

  const eliminar = useCallback(async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      dispatch({ type: "ELIMINAR", payload: id });
    } catch (error) {
      console.error("Error al eliminar participante", error);
    }
  }, []);

  const resetear = useCallback(() => {
    state.participantes.forEach((p) => {
      if (p.id) {
        axios.delete(`${API_URL}/${p.id}`, { headers: getAuthHeaders() }).catch((err) => console.error(err));
      }
    });
    dispatch({ type: "RESET", payload: [] });
  }, [state.participantes]);

  const seleccionarParaEditar = useCallback((p: Participante | null) => {
    dispatch({ type: "SET_EDITANDO", payload: p });
  }, []);

  return (
    <ParticipantesContext.Provider
      value={{
        participantes: state.participantes,
        participanteEditando: state.participanteEditando,
        agregar,
        eliminar,
        resetear,
        editar,
        seleccionarParaEditar,
      }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
}

export function useParticipantes() {
  const context = useContext(ParticipantesContext);
  if (!context) {
    throw new Error("useParticipantes debe usarse dentro de un ParticipantesProvider");
  }
  return context;
}
