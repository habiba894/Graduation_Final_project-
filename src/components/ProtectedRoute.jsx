import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoutesList from "../utils/routesList";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={RoutesList.Login} replace />;
  }

  return children;
}
