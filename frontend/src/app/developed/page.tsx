'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { useCarousel } from "@/contexts/CarouselContext";


const DevelopedComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const { createOnClick } = useCarousel();

    React.useEffect(() => {
        setQuery({
            isDeveloped: true,
        });
    }, [setQuery]);

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