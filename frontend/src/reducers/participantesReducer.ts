import { Participante } from "../models/Participante";

export type Action =
  | { type: "GET_PARTICIPANTES"; payload: Participante[] }
  | { type: "AGREGAR"; payload: Participante }
  | { type: "ELIMINAR"; payload: number }
  | { type: "RESET"; payload: Participante[] }
  | { type: "EDITAR"; payload: Participante }
  | { type: "SET_EDITANDO"; payload: Participante | null }
  | { type: "SET"; payload: Participante[] };

export interface State {
  participantes: Participante[];
  participanteEditando: Participante | null;
}

export const initialState: State = {
  participantes: [],
  participanteEditando: null,
};

export function participantesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "GET_PARTICIPANTES":
      return { ...state, participantes: action.payload };
    case "AGREGAR":
      return { ...state, participantes: [...state.participantes, action.payload] };
    case "ELIMINAR":
      return { ...state, participantes: state.participantes.filter((p) => p.id !== action.payload) };
    case "EDITAR":
      return {
        ...state,
        participantes: state.participantes.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "RESET":
      return { ...state, participantes: action.payload };
    case "SET_EDITANDO":
      return { ...state, participanteEditando: action.payload };
    case "SET":
      return { ...state, participantes: action.payload };
    default:
      return state;
  }
}
