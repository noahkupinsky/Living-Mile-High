'use client'

import SelectedWorkDisplay from './SelectedWorkDisplay';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { useEffect, useMemo } from 'react';
import { useSizing } from '@/contexts/SizingContext';
import { HouseQuerySortProvider, useHouseQuerySort } from '@/providers/houseQuerySortProvider';
import Pages from '@/config/pageConfig';

const BODY_WIDTH_PERCENTAGE = 0.55;
const BODY_HEIGHT_PERCENTAGE = 0.85;
const GAP_PERCENTAGE = 0.2;


const SelectedWorkComponent: React.FC = () => {
    const houses = useHouseQuerySort(Pages.SELECTED_WORK);
    const { bodyWidth, bodyHeight } = useSizing();

    const maxWidthIfSquare = useMemo(() =>
        Math.min(
            bodyHeight * BODY_HEIGHT_PERCENTAGE,
            bodyWidth * BODY_WIDTH_PERCENTAGE
        ),
        [bodyHeight, bodyWidth]
    );

    const gap = useMemo(() => bodyHeight * GAP_PERCENTAGE, [bodyHeight]);

    return (
        <SelectedWorkDisplay
            width={maxWidthIfSquare}
            verticalGap={gap}
            houses={houses}
        />
    );
};


const SelectedWorkPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQuerySortProvider>
            <SelectedWorkComponent />
        </HouseQuerySortProvider>
    </SiteDataLoader>
);

export default SelectedWorkPage;