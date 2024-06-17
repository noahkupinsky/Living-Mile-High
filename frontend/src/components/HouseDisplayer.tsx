import React from 'react';
import { House } from 'living-mile-high-types';

export type HouseDisplayerProps = {
    houses: House[];
};

const HouseDisplayer: React.FC<HouseDisplayerProps> = ({ houses }) => {
    return (
        <div>
            {houses.map((house) => (
                <div key={house.id}>
                    {house.address}
                </div>
            ))}
        </div>
    );
};

export default HouseDisplayer;

