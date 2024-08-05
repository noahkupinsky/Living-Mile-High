'use client';

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { env } from 'next-runtime-env';
import React, { createContext, useContext, useEffect, useState } from 'react';

const clientId = env('NEXT_PUBLIC_GOOGLE_CLIENT_ID')!;
const apiKey = env('NEXT_PUBLIC_GOOGLE_API_KEY')!;

type GoogleContextType = {
    login: () => void;
    accessToken: string | null;
    isLoaded: boolean;
};

const GoogleContext = createContext<GoogleContextType | undefined>(undefined);

const GoogleProviderInterior = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = `https://apis.google.com/js/api.js`;
            script.onload = () => {
                gapi.load('client', () => {
                    gapi.client.init({
                        apiKey: apiKey,
                        discoveryDocs: [
                            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                        ],
                    }).then(() => {
                        gapi.load('picker', () => {
                            setIsLoaded(true);
                        });
                    }).catch((error) => {
                        console.error('Error loading GAPI client for API', error);
                    });
                });
            };
            document.body.appendChild(script);
        };

        if (!window.gapi) {
            loadScript();
        } else {
            setIsLoaded(true);
        }
    }, []);

    const loginAgain = useGoogleLogin({
        onSuccess: async tokenResponse => {
            const { access_token, expires_in } = tokenResponse;
            setAccessToken(access_token);
            setTimeout(loginAgain, (expires_in - 60) * 1000);
        },
        onError: errorResponse => {
            console.error('Login Failed:', errorResponse);
        },
    });

    const login = () => {
        if (!accessToken) {
            loginAgain();
        }
    }

    return (
        <GoogleContext.Provider value={{
            accessToken,
            isLoaded,
            login
        }}>
            {children}
        </GoogleContext.Provider>
    );
};

export const GoogleProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <GoogleOAuthProvider
            clientId={clientId}
        >
            <GoogleProviderInterior>
                {children}
            </GoogleProviderInterior>
        </GoogleOAuthProvider>
    );
}

export const useGoogle = () => {
    const context = useContext(GoogleContext);
    if (context === undefined) {
        throw new Error('useGoogle must be used within a GoogleProvider');
    }
    return context;
}
