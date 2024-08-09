import React, { useState } from 'react';
import { styled, Text, View, YStack } from 'tamagui';
import AspectImage from '@/components/images/AspectImage';
import { House } from 'living-mile-high-lib';
import { FADE_SHORT } from '@/config/constants';


const FONT_PERCENTAGE = 0.05;
const SPACING_PERCENTAGE = 0.1;
const GAP_MULTIPLIER = 7;

const HouseContainer = styled(View, {
    name: 'Container',
    position: 'relative',
    marginHorizontal: '1vw',
    style: {
        transition: FADE_SHORT
    }
});

const ImageContainer = styled(View, {
    name: 'BodyContainer',
});

const AddressContainer = styled(YStack, {
    name: 'AddressContainer',
    justifyContent: 'center',
});

const AddressText = styled(Text, {
    name: 'AddressText',
    textAlign: 'right',
    color: '$darkGray',
    fontFamily: '$sc',
    fontWeight: 700,
    paddingRight: '5%',
});

export interface SimpleHouseDisplayProps {
    house: House;
    width: number
    height?: number;
    verticalGap: number;
    onClick?: () => void;
}

const SimpleHouseDisplay: React.FC<SimpleHouseDisplayProps> = ({ house, width, height, onClick, verticalGap }) => {
    const [opacity, setOpacity] = useState(0);
    const smallDimension = Math.min(width, verticalGap * GAP_MULTIPLIER);

    return (
        <HouseContainer
            opacity={opacity}>
            <ImageContainer style={{ height }
            }>
                <AspectImage
                    src={house.mainImage}
                    width={width}
                    alt={house.address}
                    onClick={onClick}
                    onDimensions={() => setOpacity(1)}
                />
            </ImageContainer>
            < AddressContainer
                height={verticalGap}>
                <AddressText
                    fontSize={smallDimension * FONT_PERCENTAGE}
                    letterSpacing={smallDimension * FONT_PERCENTAGE * SPACING_PERCENTAGE}
                >{house.address} </AddressText>
            </AddressContainer>
        </HouseContainer>
    );
};

export default SimpleHouseDisplay;