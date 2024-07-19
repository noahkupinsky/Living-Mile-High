import AspectImage from '@/components/images/AspectImage';
import { House } from 'living-mile-high-lib';
import React from 'react';
import { styled, Text, View } from 'tamagui';

const Container = styled(View, {
    name: 'Container',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
});

const BodyContainer = styled(View, {
    name: 'BodyContainer',
});

const AddressContainer = styled(View, {
    name: 'AddressContainer',
    padding: 10,
    alignItems: 'center',
});

const AddressText = styled(Text, {
    name: 'AddressText',
    fontSize: 14,
    textAlign: 'center',
});

interface SelectedWorkHouseProps {
    house: House;
    width: number;
    height: number;
}

const SelectedWorkHouse: React.FC<SelectedWorkHouseProps> = ({ house, width, height }) => {
    return (
        <Container>
            <BodyContainer style={{ height }}>
                <AspectImage src={house.mainImage} width={width} alt={house.address} />
            </BodyContainer>
            <AddressContainer>
                <AddressText>{house.address}</AddressText>
            </AddressContainer>
        </Container>
    );
};

export default SelectedWorkHouse;