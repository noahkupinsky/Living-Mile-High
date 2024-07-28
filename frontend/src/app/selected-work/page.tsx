'use client'

import Modal from '@/components/layout/Modal';
import SelectedWorkDisplay from './SelectedWorkDisplay';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { House } from 'living-mile-high-lib';
import { useEffect, useMemo, useState } from 'react';
import ImageCarousel from '@/components/images/ImageCarousel';
import { useSizing } from '@/contexts/SizingContext';

const BODY_WIDTH_PERCENTAGE = 0.55;
const BODY_HEIGHT_PERCENTAGE = 0.85;
const GAP_PERCENTAGE = 0.2;


const SelectedWorkComponent: React.FC = () => {
    const { bodyWidth, bodyHeight } = useSizing();
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

    const maxWidthIfSquare = useMemo(() =>
        Math.min(
            bodyHeight * BODY_HEIGHT_PERCENTAGE,
            bodyWidth * BODY_WIDTH_PERCENTAGE
        ),
        [bodyHeight, bodyWidth]
    );

    const gap = useMemo(() => bodyHeight * GAP_PERCENTAGE, [bodyHeight]);

    return (
        <>
            <SelectedWorkDisplay
                width={maxWidthIfSquare}
                verticalGap={gap}
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