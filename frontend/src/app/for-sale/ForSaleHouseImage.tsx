import AspectImage from '@/components/images/AspectImage';
import { House } from 'living-mile-high-lib';
import React from 'react';
import { styled, View } from 'tamagui';

const Container = styled(View, {
    name: 'Container',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ccc',
});

const BodyContainer = styled(View, {
    name: 'BodyContainer',
});

interface ForSaleHouseImageProps {
    house: House;
    width: number;
}

const ForSaleHouseImage: React.FC<ForSaleHouseImageProps> = ({ house, width }) => {
    return (
        <Container style={{ width }}>
            <BodyContainer>
                <AspectImage src={house.mainImage} width={width} alt={house.address} />
            </BodyContainer>
        </Container>
    );
};

export default ForSaleHouseImage;