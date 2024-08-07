import { FADE_MEDIUM } from '@/config/constants';
import React, { useEffect, useState } from 'react';
import { View, styled } from 'tamagui';

const ModalOverlay = styled(View, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
});

const ModalContent = styled(View, {
    backgroundColor: '$whiteBg',
    padding: 20,
    borderRadius: 10,
    zIndex: 2000,
});

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setOpacity(1);
        } else {
            setOpacity(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <ModalOverlay opacity={opacity} style={{ position: 'fixed', transition: FADE_MEDIUM }} onPress={onClose}>
            <ModalContent onPress={(e: any) => e.stopPropagation()}>
                {children}
            </ModalContent>
        </ModalOverlay>
    );
};

export default Modal;