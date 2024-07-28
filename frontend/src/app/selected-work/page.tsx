'use client'

import Modal from '@/components/layout/Modal';
import SelectedWorkDisplay from './SelectedWorkDisplay';
import SiteDataLoader from '@/components/layout/SiteDataLoader';
import { HouseQueryProvider, useHouseQuery } from '@/contexts/HouseQueryContext';
import { House } from 'living-mile-high-lib';
import { useEffect, useMemo, useState } from 'react';
import ImageCarousel from '@/components/images/ImageCarousel';
import { useSizing } from '@/contexts/SizingContext';
import { useCarousel } from '@/contexts/CarouselContext';

const BODY_WIDTH_PERCENTAGE = 0.55;
const BODY_HEIGHT_PERCENTAGE = 0.85;
const GAP_PERCENTAGE = 0.2;


const SelectedWorkComponent: React.FC = () => {
    const { bodyWidth, bodyHeight } = useSizing();
    const { houses, setQuery } = useHouseQuery();
    const { handleImageClick } = useCarousel();

    useEffect(() => {
        setQuery({
            isSelectedWork: true,
        });
    }, [setQuery]);

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
            onClick={handleImageClick}
        />
    );
};


const SelectedWorkPage: React.FC = () => (
    <SiteDataLoader>
        <HouseQueryProvider>
            <SelectedWorkComponent />
        </HouseQueryProvider>
    </SiteDataLoader>
);

export default SelectedWorkPage;