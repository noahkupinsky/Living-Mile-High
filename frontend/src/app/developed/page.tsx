'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { House } from "living-mile-high-lib";
import Modal from "@/components/layout/Modal";
import ImageCarousel from "@/components/images/ImageCarousel";


const DevelopedComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
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

    React.useEffect(() => {
        setQuery({
            isDeveloped: true,
        });
    }, [setQuery]);

    return (
        <>
            <SimpleColumnDisplay houses={houses} maxColumns={4} minColumns={2} onClick={handleImageClick} />
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

const DevelopedPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQueryProvider>
            <DevelopedComponent />
        </HouseQueryProvider>
    </SiteDataLoader>
);

export default DevelopedPage;