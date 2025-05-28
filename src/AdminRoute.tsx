import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const AdminRoute = () => {
  const { isAuthenticated, userRole } = useAuth();
  console.log("Auth:", isAuthenticated, "Role:", userRole);

  return isAuthenticated && userRole === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default AdminRoute;
