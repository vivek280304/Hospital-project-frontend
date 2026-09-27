import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const role = user?.role?.toLowerCase();

  if (role) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;