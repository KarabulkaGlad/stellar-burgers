import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../../services/features/auth/auth";
import { useSelector } from "../../services/store";

export const ProtectedRouteAuth = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet/>;
}