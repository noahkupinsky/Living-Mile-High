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
    onClick: (house: House) => void;
}

const ForSaleHouseColumn: React.FC<ForSaleHouseColumnProps> = ({ houses, imageWidth, textWidth, onClick }) => {
    return (
        <ColumnContainer>
            {houses.map((house) => (
                <ForSaleHouseEntry
                    key={house.id}
                    house={house}
                    imageWidth={imageWidth}
                    textWidth={textWidth}
                    onClick={onClick}
                />
            ))}
        </ColumnContainer>
    );
};

export default ForSaleHouseColumn;