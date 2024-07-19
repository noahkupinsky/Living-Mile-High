'use client'

import SelectedWorkDisplay from '@/components/houses/selected-work/SelectedWorkDisplay';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { useEffect } from 'react';

const SelectedWorkComponent: React.FC = () => {
    const { houses, setQuery } = useHouseQuery();

    useEffect(() => {
        setQuery({
            isSelectedWork: true,
        });
    }, [setQuery]);

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