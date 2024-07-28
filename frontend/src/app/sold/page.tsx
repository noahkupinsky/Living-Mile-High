'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SiteDataLoader from "@/components/layout/SiteDataLoader";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";


const SoldComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isDeveloped: false,
    });

    React.useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    return (
        <SimpleColumnDisplay houses={houses} maxColumns={4} />
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