'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import { HouseSortName } from "@/types";


const SoldComponent: React.FC = () => {
    const { houses, configure } = useHouseQuery();
    React.useEffect(() => {
        configure({
            query: {
                isForSale: false,
            },
            sort: HouseSortName.LEXICOGRAPHIC
        });
    }, [configure]);

    return (
        <SimpleColumnDisplay houses={houses} maxColumns={4} minColumns={2} />
    );
};

const SoldPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQueryProvider>
            <SoldComponent />
        </HouseQueryProvider>
    </SiteDataLoader>
);

export default SoldPage;