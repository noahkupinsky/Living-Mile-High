import { House } from 'living-mile-high-lib';
import React from 'react';
import { styled, View } from 'tamagui';
import ForSaleHouseTextArea from './ForSaleHouseTextArea';
import ForSaleHouseImage from './ForSaleHouseImage';

const EntryContainer = styled(View, {
    name: 'EntryContainer',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 200,
    borderWidth: 1,
    borderColor: '#ccc',
});

interface HouseEntryProps {
    house: House;
    imageWidth: number;
    textWidth: number;
    onClick: (house: House) => void;
}

const HouseEntry: React.FC<HouseEntryProps> = ({ house, imageWidth, textWidth, onClick }) => {
    return (
        <EntryContainer>
            <ForSaleHouseImage house={house} width={imageWidth} onClick={onClick} />
            <ForSaleHouseTextArea house={house} width={textWidth} />
        </EntryContainer>
    );
};

export default HouseEntry;