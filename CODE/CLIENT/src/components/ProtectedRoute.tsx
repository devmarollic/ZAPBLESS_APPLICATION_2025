
import { Navigate, Outlet } from 'react-router-dom';
import { AuthenticationService } from '@/lib/authentication_service';
import { HttpClient } from '@/lib/http_client';

const ProtectedRoute = () => {
    const isAuthenticated = AuthenticationService.isAuthenticated();

    if (AuthenticationService.isAuthenticated()) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
