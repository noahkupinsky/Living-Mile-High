'use client'

import SiteDataLoader from "@/components/layout/SiteDataLoader";
import ForSaleHouse from "./ForSaleHouse";
import { View } from "react-native";
import { styled } from "tamagui";
import { useSizing } from "@/contexts/SizingContext";
import { HouseQuerySortProvider, useHouseQuerySort } from "@/providers/houseQuerySortProvider";
import Pages from "@/config/pageConfig";

const ColumnContainer = styled(View, {
    name: 'ColumnContainer',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
});

const WIDTH_PERCENTAGE = 0.9;
const HEIGHT_PERCENTAGE = 0.9;

const ForSaleComponent = () => {
    const houses = useHouseQuerySort(Pages.FOR_SALE);
    const { bodyWidth, bodyHeight } = useSizing();

    return (
        <ColumnContainer>
            {houses.map(house => (
                <ForSaleHouse
                    key={house.id!}
                    house={house}
                    maxWidth={bodyWidth * WIDTH_PERCENTAGE}
                    maxHeight={bodyHeight * HEIGHT_PERCENTAGE}
                />
            ))}
        </ColumnContainer>
    );
};

const ForSalePage = () => {
    return (
        <SiteDataLoader>
            <HouseQuerySortProvider>
                <ForSaleComponent />
            </HouseQuerySortProvider>
        </SiteDataLoader>
    )
}

export default ForSalePage;