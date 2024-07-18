import React from 'react';
import { styled, Text, View } from 'tamagui';
import AspectImage from '@/components/images/AspectImage';
import { House } from 'living-mile-high-lib';

const Container = styled(View, {
    name: 'Container',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
});

const BodyContainer = styled(View, {
    name: 'BodyContainer',
});

const AddressContainer = styled(View, {
    name: 'AddressContainer',
    padding: 10,
});

const AddressText = styled(Text, {
    name: 'AddressText',
    fontSize: 14,
    textAlign: 'left',
});

export interface HouseComponentProps {
    house: House;
    width: number
    height?: number;
}

const HouseComponent: React.FC<HouseComponentProps> = ({ house, width, height }) => {
    return (
        <Container>
            <BodyContainer style={{ height }
            }>
                <AspectImage src={house.mainImage} width={width} alt={house.address} />
            </BodyContainer>
            < AddressContainer >
                <AddressText>{house.address} </AddressText>
            </AddressContainer>
        </Container>
    );
};

export default HouseComponent;