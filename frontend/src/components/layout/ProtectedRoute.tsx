'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, checkAuthentication } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, router, pathname]);

    if (!isAuthenticated) {
        return null; // or a loading spinner, etc.
    }

    return <>{children}</>;
}

export default ProtectedRoute;