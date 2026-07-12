import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export function ProtectedRoutes() {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) return <div>Loading…</div>; // or a proper skeleton
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}