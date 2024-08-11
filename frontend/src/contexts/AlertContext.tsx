'use client';

import { WithAlertOptions, AlertTitle, AlertType } from '@/types';
import { Toast, ToastProvider, ToastViewport, useToastController, useToastState } from '@tamagui/toast';
import { createContext, useCallback, useContext } from 'react';
import { YStack, Spinner } from 'tamagui';

type AlertFunctionAsync = () => Promise<AlertType | null>;
type AlertFunctionSync = () => AlertType | null;

type AlertContextType = {
    withAlertAsync: (fn: AlertFunctionAsync, options?: WithAlertOptions) => Promise<void>;
    withAlertSync: (fn: AlertFunctionSync, options?: WithAlertOptions) => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined)

const AlertColor: Record<AlertTitle, string> = {
    [AlertTitle.LOADING]: 'lightblue',
    [AlertTitle.SUCCESS]: 'lightgreen',
    [AlertTitle.ERROR]: 'tomato',
    [AlertTitle.WARNING]: 'orange',
}

const AlertWidth: Record<AlertTitle, number> = {
    [AlertTitle.LOADING]: 10,
    [AlertTitle.SUCCESS]: 20,
    [AlertTitle.ERROR]: 25,
    [AlertTitle.WARNING]: 25,
}

const AlertDefaultDuration: Record<AlertTitle, number> = {
    [AlertTitle.LOADING]: 0, // never used
    [AlertTitle.SUCCESS]: 1500,
    [AlertTitle.ERROR]: 2500,
    [AlertTitle.WARNING]: 2500,
}

export const AlertProviderInterior = ({ children }: { children: React.ReactNode }) => {
    const toast = useToastController();
    const currentToast = useToastState();

    const CurrentToast = () => {
        if (!currentToast || currentToast.isHandledNatively) return null

        const color = AlertColor[currentToast.title as AlertTitle]

        const widthNumber = AlertWidth[currentToast.title as AlertTitle]
        const xNumber = (100 - widthNumber) / 2;

        const width = `${widthNumber}vw`
        const x = `${xNumber}vw`


        return (
            <Toast
                key={currentToast.id}
                x={x}
                width={width}
                backgroundColor={color}
                viewportName={currentToast.viewportName}
            >
                <YStack alignItems='center'>
                    <Toast.Title>{currentToast.title}</Toast.Title>
                    {currentToast.title === AlertTitle.LOADING ?
                        <Spinner />
                        :
                        !!currentToast.message && (
                            <Toast.Description color={'black'}>{currentToast.message}</Toast.Description>
                        )
                    }
                </YStack>
            </Toast>
        )
    }

    const hideOnTimeout = useCallback((alert: AlertType) => {
        setTimeout(() => {
            toast.hide();
        }, alert.duration || AlertDefaultDuration[alert.title as AlertTitle]);
    }, [toast]);

    const withAlertAsync = useCallback(async (alertFunction: AlertFunctionAsync, options?: WithAlertOptions) => {
        const { noLoading } = options || {};
        if (!noLoading) toast.show(AlertTitle.LOADING, {});

        const alert = await alertFunction();

        if (!noLoading) toast.hide();

        if (alert !== null) {
            toast.show(alert.title, {
                message: alert.message,
            });

            hideOnTimeout(alert);
        }
    }, [toast, hideOnTimeout]);

    const withAlertSync = useCallback((alertFunction: AlertFunctionSync, options?: WithAlertOptions) => {
        const alert = alertFunction();

        if (alert !== null) {
            toast.show(alert.title, {
                message: alert.message,
            });

            hideOnTimeout(alert);
        }
    }, [toast, hideOnTimeout]);

    return (
        <AlertContext.Provider value={{ withAlertAsync, withAlertSync }}>
            <ToastViewport />
            <CurrentToast />
            {children}
        </AlertContext.Provider>
    );
}

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ToastProvider>
            <AlertProviderInterior>
                {children}
            </AlertProviderInterior>
        </ToastProvider>
    );
}

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within a AlertProvider');
    }
    return context;
}
