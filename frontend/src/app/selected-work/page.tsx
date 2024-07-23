'use client'

import Modal from '@/components/layout/Modal';
import SelectedWorkDisplay from './SelectedWorkDisplay';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { House } from 'living-mile-high-lib';
import { useEffect, useState } from 'react';
import ImageCarousel from '@/components/images/ImageCarousel';

const SelectedWorkComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setQuery({
            isSelectedWork: true,
        });
    }, [setQuery]);


    const handleImageClick = (house: House) => {
        setSelectedHouse(house);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const houseImages = selectedHouse ? [selectedHouse.mainImage].concat(selectedHouse.images) : [];

    return (
        <>
            <SelectedWorkDisplay
                width={500}
                houses={houses}
                onClick={handleImageClick}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                <ImageCarousel
                    images={houseImages}
                />
            </Modal>
        </>
    );
};

const SelectedWorkPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQueryProvider>
            <SelectedWorkComponent />
        </HouseQueryProvider>
    </SiteDataLoader>
);

export default SelectedWorkPage;