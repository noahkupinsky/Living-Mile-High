'use client'

import services, { ServiceDict } from "@/di";
import { createContext, useContext, useMemo } from "react";

const ServiceContext = createContext<ServiceDict | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const serviceDict = useMemo(() => services(), []);

    return (
        <ServiceContext.Provider value={serviceDict}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = () => {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
}