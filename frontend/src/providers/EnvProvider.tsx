import React, { createContext, useContext } from 'react';

interface EnvContextProps {
    [key: string]: string | undefined;
}

const EnvContext = createContext<EnvContextProps | undefined>(undefined);

export const EnvProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const runtimeEnvConfig: EnvContextProps = {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
    };

    return (
        <EnvContext.Provider value={runtimeEnvConfig}>
            {children}
        </EnvContext.Provider>
    );
};

export const useEnv = () => {
    const context = useContext(EnvContext);
    if (context === undefined) {
        throw new Error('useEnv must be used within an EnvProvider');
    }
    return context;
};