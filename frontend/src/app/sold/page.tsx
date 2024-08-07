'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";


const SoldComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isDeveloped: false,
        isForSale: false,
    });

    React.useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

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