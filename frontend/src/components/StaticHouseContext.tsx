import React, { useState, useEffect } from 'react';
import { HouseProvider } from './HouseContext';
import { House } from 'living-mile-high-lib';

const HOUSES: House[] = [
    {
        id: '1',
        isDeveloped: true,
        isForSale: true,
        isSelectedWork: true,
        address: 'Beautiful Villa',
        mainImage: 'https://fastly.picsum.photos/id/1049/200/300.jpg?hmac=IwgFpI60m03JoXBvIB_0oA12YR8cNaSel6lUvKhQvF0',
        neighborhood: 'Countryside',
        stats: {},
        images: [],
    },
    {
        id: '2',
        isDeveloped: true,
        isForSale: true,
        isSelectedWork: true,
        address: 'Cozy Cottage',
        mainImage: 'https://fastly.picsum.photos/id/260/200/300.jpg?hmac=_VpBxDn0zencTyMnssCV14LkW80zG7vw2rw7WCQ2uVo',
        neighborhood: 'Countryside',
        stats: {},
        images: [],
    },
];

export type StaticHouseContextProps = {
    children: React.ReactNode;
}

const StaticHouseContext = ({ children }: StaticHouseContextProps) => {
    const [houses, setHouses] = useState<House[]>([]);

    useEffect(() => {
        setHouses(HOUSES);
    }, []);

    return (
        <HouseProvider value={{ houses }}>
            {children}
        </HouseProvider>
    );
};

export default StaticHouseContext;