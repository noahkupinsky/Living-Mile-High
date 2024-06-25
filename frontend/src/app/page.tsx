"use client";

import RotatingHouseDisplay from '@/components/RotatingHouseDisplay';
import HouseQueryContext from '@/components/HouseQueryContext';

const Home: React.FC = () => {
    return (
        <div>
            <HouseQueryContext>
                <RotatingHouseDisplay interval={3000} />
            </HouseQueryContext>
        </div>
    );
};

export default Home;