'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import HouseForm from './HouseForm';
import { useSiteData } from '@/contexts/SiteDataContext';
import { House } from 'living-mile-high-lib';
import { LockProvider } from '@/contexts/LockContext';

const HouseFormPage: React.FC = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { houses } = useSiteData();
    const [house] = useState<House | undefined>(id ? houses.find(house => house.id === id) : undefined);

    return (
        <HouseForm house={house} />
    );
};

export default HouseFormPage;