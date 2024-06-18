"use client";

import RotatingHouseDisplay from '@/components/RotatingHouseDisplay';
import { HouseQuery } from 'living-mile-high-types';
import Link from 'next/link';
import HouseQueryContext from '@/components/HouseQueryContext';

const HOME_PAGE_QUERY: HouseQuery = {
    onHomePage: 'true'
}

const Home: React.FC = () => {
    return (
        <div>
            <HouseQueryContext initialQuery={HOME_PAGE_QUERY}>
                <RotatingHouseDisplay interval={3000} />
            </HouseQueryContext>
        </div>
    );
};

export default Home;