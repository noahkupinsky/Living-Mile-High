'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import HouseForm from './HouseForm';
import { useSiteData } from '@/contexts/SiteDataContext';
import { House } from 'living-mile-high-lib';

const HouseFormPage: React.FC = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { houses } = useSiteData();
    const [house, setHouse] = useState<House | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const selectedHouse = houses.find(house => house.id === id);
            console.log(selectedHouse);
            setHouse(selectedHouse);
        }
    }, [id, houses]);

    return (
        <HouseForm house={house} />
    );
};

export default HouseFormPage;