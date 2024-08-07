'use client'

import ImageCarousel from '@/components/images/ImageCarousel';
import Modal from '@/components/layout/Modal';
import { HouseOnClickCreator } from '@/types';
import { House } from 'living-mile-high-lib';
import React, { createContext, useState, useContext } from 'react';

type CarouselContextType = {
    createOnClick: HouseOnClickCreator;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
}

export const CarouselProvider = ({ children }: AuthProviderProps) => {
    const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const createOnClick: HouseOnClickCreator = (house) => {
        return house.images.length > 0 ? () => {
            setSelectedHouse(house);
            setIsModalOpen(true);
        } : undefined;
    }

    const houseImages = selectedHouse ? [selectedHouse.mainImage].concat(selectedHouse.images) : [];

    return (
        <CarouselContext.Provider value={{
            createOnClick
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