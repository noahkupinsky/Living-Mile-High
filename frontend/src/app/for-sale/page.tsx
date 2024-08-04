'use client'

import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { HouseQueryProvider, useHouseQuery } from "@/contexts/HouseQueryContext";
import { useEffect } from "react";
import ForSaleHouse from "./ForSaleHouse";
import { View } from "react-native";
import { styled } from "tamagui";
import { useSizing } from "@/contexts/SizingContext";
import { useCarousel } from "@/contexts/CarouselContext";

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
    const { handleImageClick } = useCarousel();

    useEffect(() => {
        setQuery({
            isForSale: true,
        });
    }, [setQuery]);

    useEffect(() => {
        console.log('houses', houses);
    }, [houses]);

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