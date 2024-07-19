import { House } from 'living-mile-high-lib';
import React from 'react';
import { styled, View } from 'tamagui';
import ForSaleHouseTextArea from './ForSaleHouseTextArea';
import ForSaleHouseImage from './ForSaleHouseImage';

const EntryContainer = styled(View, {
    name: 'EntryContainer',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
});

interface HouseEntryProps {
    house: House;
    imageWidth: number;
    textWidth: number;
}

const HouseEntry: React.FC<HouseEntryProps> = ({ house, imageWidth, textWidth }) => {
    return (
        <EntryContainer>
            <ForSaleHouseImage house={house} width={imageWidth} />
            <ForSaleHouseTextArea house={house} width={textWidth} />
        </EntryContainer>
    );
};

export default HouseEntry;