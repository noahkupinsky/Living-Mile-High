import React from 'react';
import { House } from 'living-mile-high-types';
import { View, styled } from 'tamagui';

export type HouseDisplayerProps = {
    houses: House[];
};

const HouseContainer = styled(View, {
    background: '$background',
})

const HouseDisplayer: React.FC<HouseDisplayerProps> = ({ houses }) => {
    return (
        <HouseContainer>
            {houses.map((house) => (
                <div key={house.id}>
                    {house.address}
                </div>
            ))}
        </HouseContainer>
    );
};

export default HouseDisplayer;

