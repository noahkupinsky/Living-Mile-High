'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SimpleNeighborhoodGrouping from "@/components/houses/simple/SimpleNeighborhoodGrouping";
import SiteDataLoader from "@/components/layout/SiteDataLoader";


const SoldComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isDeveloped: false,
    });

    React.useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    return (
        <SimpleNeighborhoodGrouping houses={houses} width={200} columns={4} />
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