'use client'

import HouseComponent from "@/components/houses/HouseComponent";
import ColumnDisplay from "@/components/houses/ColumnDisplay";
import LoadingComponent from "@/components/LoadingComponent";
import { useHouseQuery, HouseQueryProvider } from "@/contexts/HouseQueryContext";
import React, { useState } from "react";
import { House } from "living-mile-high-lib";


const SoldColumnDisplay: React.FC = () => {
    const { setQuery } = useHouseQuery();
    const [query] = useState({
        isSelectedWork: true,
    });


    React.useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    const renderHouse = (house: House, width: number, height: number | undefined) => (
        <HouseComponent key={house.id} house={house} width={width} height={height} />
    );

    return (
        <ColumnDisplay
            columns={3}
            width={350}
            renderHouse={renderHouse}
        />
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