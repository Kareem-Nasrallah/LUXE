import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const AdminProtectedRoute = () => {
  const location = useLocation();

  // عدل ده حسب شكل الauth عندك
  const { user } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = user && user.role === "admin";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
