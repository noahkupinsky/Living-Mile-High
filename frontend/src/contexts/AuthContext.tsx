'use client'

import services from '@/di';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { apiService } = services();

    const checkAuthentication = useCallback(async () => {
        const authenticated = await apiService.verifyAuthenticated();
        setIsAuthenticated(authenticated);
    }, [apiService]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    const login = useCallback(async (username: string, password: string) => {
        const success = await apiService.login(username, password);
        if (success) {
            setIsAuthenticated(true);
        }
        return success;
    }, [apiService]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};