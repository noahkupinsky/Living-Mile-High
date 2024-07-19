'use client'

import LoadingComponent from "@/components/LoadingComponent";
import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import SimpleNeighborhoodGrouping from "@/components/houses/simple/SimpleNeighborhoodGrouping";
import { NEIGHBORHOOD_GROUPS } from "@/config/constants";
import { House } from "living-mile-high-lib";


const SoldColumnDisplay: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isSelectedWork: true,
    });




    React.useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    return (
        <SimpleNeighborhoodGrouping houses={houses} width={200} columns={4} />
    );
};

const SoldPage: React.FC = () => (
    <LoadingComponent>
        <HouseQueryProvider>
            <SoldColumnDisplay />
        </HouseQueryProvider>
    </LoadingComponent>
);

export default SoldPage;