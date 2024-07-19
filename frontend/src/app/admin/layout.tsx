import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SiteDataLoader from '@/components/layout/SiteDataLoader';

const AdminLayout = ({ children }: any) => {
    return (
        <ProtectedRoute>
            <SiteDataLoader>
                {children}
            </SiteDataLoader>
        </ProtectedRoute>
    );
};

export default AdminLayout;