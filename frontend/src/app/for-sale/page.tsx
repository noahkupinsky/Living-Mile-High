'use client'

import SiteDataLoader from "@/components/layout/SiteDataLoader";
import { HouseQueryProvider, useHouseQuery } from "@/contexts/HouseQueryContext";
import { useEffect, useState } from "react";
import ForSaleHouseColumn from "./ForSaleHouseColumn";

const ForSaleComponent = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isForSale: true,
    })

    useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    return <ForSaleHouseColumn houses={houses} imageWidth={400} textWidth={300} />;
};

const ForSalePage = () => {
    return (
        <SiteDataLoader>
            <HouseQueryProvider>
                <ForSaleComponent />
            </HouseQueryProvider>
        </SiteDataLoader>
    )
}

export default ForSalePage;