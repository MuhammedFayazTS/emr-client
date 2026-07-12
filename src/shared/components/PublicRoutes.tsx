import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AuthLoadingScreen } from '@/features/auth/components/AuthLoadingScreen';

export function PublicRoutes() {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) return <AuthLoadingScreen />;

    if (user) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}