'use client'

import SelectedWorkDisplay from './SelectedWorkDisplay';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { useEffect, useState } from 'react';

const SelectedWorkComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();
    const [query] = useState({
        isSelectedWork: true,
    })

    useEffect(() => {
        setQuery(query);
    }, [setQuery, query]);

    return <SelectedWorkDisplay
        width={300}
        houses={houses}
    />;
};

const SelectedWorkPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQueryProvider>
            <SelectedWorkComponent />
        </HouseQueryProvider>
    </SiteDataLoader>
);

export default SelectedWorkPage;