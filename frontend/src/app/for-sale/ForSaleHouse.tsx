import React, { useCallback, useEffect, useState } from 'react';
import { styled, View, XStack, Text, YStack } from 'tamagui';
import { House } from 'living-mile-high-lib';
import { FADE_MEDIUM, STAT_TEMPLATES } from '@/config/constants';
import AspectImage from '@/components/images/AspectImage';
import { minV, requestAnimationFrames } from '@/utils/misc';

const EntryContainer = styled(XStack, {
    name: 'EntryContainer',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: minV(15),
    backgroundColor: '$lightBg',
    style: {
        transition: FADE_MEDIUM
    }
});

const TextContainer = styled(YStack, {
    name: 'Container',
    padding: minV(2),
    justifyContent: 'space-between',
});

const BoldText = styled(Text, {
    name: 'AddressText',
    fontFamily: '$caps',
    color: '$black',
    textAlign: 'center',
});

const StatText = styled(Text, {
    name: 'StatText',
    fontFamily: '$caps',
    color: '$darkGray',
    textAlign: 'left',
    flex: 1
});

const BigSpacer = styled(View, {
    name: 'BigSpacer',
    flex: 5
});

interface ForSaleHouseProps {
    house: House;
    maxWidth: number;
    maxHeight: number;
    onClick: (house: House) => void;
}

const IMAGE_PERCENTAGE = 0.7;
const BOLD_PERCENTAGE = (1 - IMAGE_PERCENTAGE) * 0.07;
const STAT_PERCENTAGE = (1 - IMAGE_PERCENTAGE) * 0.06;

const ForSaleHouse: React.FC<ForSaleHouseProps> = ({ house, maxWidth, maxHeight, onClick }) => {
    const [opacity, setOpacity] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { address, neighborhood, mainImage, stats } = house;

    const renderStats = () => {
        return STAT_TEMPLATES.map(([key, template], index) => {
            if (stats[key] !== undefined) {
                return (
                    <StatText
                        key={index}
                        fontSize={dimensions.width * STAT_PERCENTAGE}
                    >
                        {template.replace('$', stats[key].toString())}
                    </StatText>
                );
            }
            return null;
        });
    };

    useEffect(() => {
        if (dimensions.width !== 0 && opacity === 0) {
            requestAnimationFrames(() => setOpacity(1));
        }
    }, [dimensions, opacity]);

    useEffect(() => {
        console.log('rendering house', house);
    }, [house]);

    const renderBold = (text: string) => {
        return (
            <BoldText
                key={text}
                fontSize={dimensions.width * BOLD_PERCENTAGE}
            >
                {text}
            </BoldText>
        );
    };

    const onDimensions = useCallback((dimensions: { width: number; height: number }) => {
        setDimensions({ width: dimensions.width / IMAGE_PERCENTAGE, height: dimensions.height });
    }, []);


    return (
        <EntryContainer
            opacity={opacity}
        >
            <AspectImage
                src={mainImage}
                width={maxWidth * IMAGE_PERCENTAGE}
                height={maxHeight}
                alt={address}
                noFade
                onDimensions={onDimensions}
                onClick={() => onClick(house)}
            />
            <TextContainer
                width={dimensions.width * (1 - IMAGE_PERCENTAGE)}
                height={dimensions.height}
            >
                {renderBold(address)}
                <BigSpacer key={"topSpacer"} />
                {renderStats()}
                <BigSpacer key={"bottomSpacer"} />
                {renderBold(neighborhood || ' ')}
            </TextContainer>
        </EntryContainer>
    );
};

export default ForSaleHouse;