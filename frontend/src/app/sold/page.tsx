'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React from "react";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import { HouseQuerySortProvider, useHouseQuerySort } from "@/providers/houseQuerySortProvider";
import Pages from "@/config/pageConfig";


const SoldComponent: React.FC = () => {
    const houses = useHouseQuerySort(Pages.SOLD);

    return (
        <SimpleColumnDisplay houses={houses} maxColumns={4} minColumns={2} />
    );
};

const SoldPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQuerySortProvider>
            <SoldComponent />
        </HouseQuerySortProvider>
    </SiteDataLoader>
);

export default SoldPage;