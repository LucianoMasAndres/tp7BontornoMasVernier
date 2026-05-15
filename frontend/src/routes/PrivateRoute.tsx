import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  rol?: "ADMIN" | "CONSULTA";
}

export default function PrivateRoute({ children, rol }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (rol && user.rol !== rol) return <Navigate to="/menu_inicio" />;

  return children;
}
