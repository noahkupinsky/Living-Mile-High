import React from 'react';
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
    if (!isOpen) return null;

    return (
        <ModalOverlay style={{ position: 'fixed' }} onPress={onClose}>
            <ModalContent onPress={(e: any) => e.stopPropagation()}>
                {children}
            </ModalContent>
        </ModalOverlay>
    );
};

export default Modal;