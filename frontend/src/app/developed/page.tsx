'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useEffect } from "react";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { useCarousel } from "@/contexts/CarouselContext";
import { HouseSortBy } from "@/types";


const DevelopedComponent: React.FC = () => {
    const { houses, configure } = useHouseQuery();
    const { createOnClick } = useCarousel();

    useEffect(() => {
        configure({
            query: {
                isDeveloped: true,
            },
            sort: HouseSortBy.LEXICOGRAPHIC
        });
    }, [configure]);

    return (
        <SimpleColumnDisplay houses={houses} maxColumns={4} minColumns={2} createOnClick={createOnClick} />
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