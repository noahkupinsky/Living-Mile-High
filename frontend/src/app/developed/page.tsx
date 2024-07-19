'use client'

import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SimpleColumnDisplay from "@/components/houses/SimpleColumnDisplay";
import SiteDataLoader from "@/components/layout/SiteDataLoader";


const DevelopedComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isDeveloped: true,
    });

    React.useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    return (
        <SimpleColumnDisplay houses={houses} width={200} columns={4} />
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