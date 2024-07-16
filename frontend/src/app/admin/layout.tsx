import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingComponent from '@/components/LoadingComponent';

const AdminLayout = ({ children }: any) => {
    return (
        <ProtectedRoute>
            <LoadingComponent>
                {children}
            </LoadingComponent>
        </ProtectedRoute>
    );
};

export default AdminLayout;