'use client'

import React from 'react';
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { useCarousel } from "@/contexts/CarouselContext";
import { HouseQuerySortProvider, useHouseQuerySort } from "@/providers/houseQuerySortProvider";
import Pages from '@/config/pageConfig';


const DevelopedComponent: React.FC = () => {
    const houses = useHouseQuerySort(Pages.DEVELOPED);
    const { createOnClick } = useCarousel();

    return (
        <SimpleColumnDisplay houses={houses} maxColumns={4} minColumns={2} createOnClick={createOnClick} />
    );
};

const DevelopedPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQuerySortProvider>
            <DevelopedComponent />
        </HouseQuerySortProvider>
    </SiteDataLoader>
);

export default DevelopedPage;