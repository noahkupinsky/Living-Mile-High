'use client'

import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { HouseQueryProvider, useHouseQuery } from "@/contexts/HouseQueryContext";
import { useEffect, useState } from "react";
import ForSaleHouse from "./ForSaleHouse";
import { House } from "living-mile-high-lib";
import Modal from "@/components/layout/Modal";
import ImageCarousel from "@/components/images/ImageCarousel";
import { View } from "react-native";
import { styled } from "tamagui";
import { useSizing } from "@/contexts/SizingContext";

const ColumnContainer = styled(View, {
    name: 'ColumnContainer',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
});

const WIDTH_PERCENTAGE = 0.9;
const HEIGHT_PERCENTAGE = 0.9;

const ForSaleComponent = () => {
    const { bodyWidth, bodyHeight } = useSizing();
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
        <ColumnContainer>
            {houses.map(house => (
                <ForSaleHouse
                    key={house.address}
                    house={house}
                    maxWidth={bodyWidth * WIDTH_PERCENTAGE}
                    maxHeight={bodyHeight * HEIGHT_PERCENTAGE}
                    onClick={handleImageClick}
                />
            ))}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                <ImageCarousel
                    images={houseImages}
                />
            </Modal>
        </ColumnContainer>
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