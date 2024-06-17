import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// Import other providers here, e.g., ReduxProvider, ThemeProvider, etc.
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '@/tamagui.config';

const queryClient = new QueryClient();

type ProviderProps = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    const [theme, setTheme] = useRootTheme()
    return (
        <QueryClientProvider client={queryClient}>
            <NextThemeProvider
                defaultTheme="light"
                onChangeTheme={setTheme as any}
            >
                <TamaguiProvider
                    config={tamaguiConfig}
                    disableInjectCSS
                    disableRootThemeClass
                    defaultTheme={theme}
                >
                    {/* Add other providers here */}
                    {children}
                </TamaguiProvider>
            </NextThemeProvider>
        </QueryClientProvider>
    );
};

export default Providers;