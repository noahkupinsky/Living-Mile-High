import React from 'react';
import { styled, View } from 'tamagui';
import ForSaleHouseEntry from './ForSaleHouseEntry';
import { House } from 'living-mile-high-lib';

const ColumnContainer = styled(View, {
    name: 'ColumnContainer',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
});

interface ForSaleHouseColumnProps {
    houses: House[];
    imageWidth: number;
    textWidth: number;
}

const ForSaleHouseColumn: React.FC<ForSaleHouseColumnProps> = ({ houses, imageWidth, textWidth }) => {
    return (
        <ColumnContainer>
            {houses.map((house) => (
                <ForSaleHouseEntry
                    key={house.id}
                    house={house}
                    imageWidth={imageWidth}
                    textWidth={textWidth}
                />
            ))}
        </ColumnContainer>
    );
};

export default ForSaleHouseColumn;