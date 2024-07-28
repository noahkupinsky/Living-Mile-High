'use client'

import ImageCarousel from '@/components/images/ImageCarousel';
import Modal from '@/components/layout/Modal';
import { House } from 'living-mile-high-lib';
import React, { createContext, useState, useContext } from 'react';

type CarouselContextType = {
    handleImageClick: (house: House) => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
}

export const CarouselProvider = ({ children }: AuthProviderProps) => {
    const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleImageClick = (house: House) => {
        setSelectedHouse(house);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const houseImages = selectedHouse ? [selectedHouse.mainImage].concat(selectedHouse.images) : [];

    return (
        <CarouselContext.Provider value={{
            handleImageClick
        }}>
            {children}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                <ImageCarousel
                    images={houseImages}
                />
            </Modal>
        </CarouselContext.Provider>
    );
};

export const useCarousel = (): CarouselContextType => {
    const context = useContext(CarouselContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};