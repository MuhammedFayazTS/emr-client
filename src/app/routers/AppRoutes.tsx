import { Route, Navigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

const Dashboard = () => <div className="p-6">Dashboard Page Content</div>;

function AppRoutes() {
    return (
        <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
    );
}

export default AppRoutes;