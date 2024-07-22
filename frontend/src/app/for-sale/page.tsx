'use client'

import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { HouseQueryProvider, useHouseQuery } from "@/contexts/HouseQueryContext";
import { useEffect, useState } from "react";
import ForSaleHouseColumn from "./ForSaleHouseColumn";
import { House } from "living-mile-high-lib";
import Modal from "@/components/layout/Modal";
import ImageCarousel from "@/components/images/ImageCarousel";

const ForSaleComponent = () => {
    const { houses, setQuery } = useHouseQuery();
    const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setQuery({
            isForSale: true,
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
            <ForSaleHouseColumn
                houses={houses}
                imageWidth={400}
                textWidth={300}
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

const ForSalePage = () => {
    return (
        <SiteDataLoader>
            <HouseQueryProvider>
                <ForSaleComponent />
            </HouseQueryProvider>
        </SiteDataLoader>
    )
}

export default ForSalePage;