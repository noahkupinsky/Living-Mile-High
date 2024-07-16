'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

const AdminPanel = () => {
    return (
        <div>
            <h1>Admin Panel</h1>
        </div>
    );
};

const AdminPage = () => (
    <ProtectedRoute>
        <AdminPanel />
    </ProtectedRoute>
);

export default AdminPage;