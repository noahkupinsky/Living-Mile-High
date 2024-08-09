import { calculateMaxHeight } from '@/utils/houseRendering';
import { House } from 'living-mile-high-lib';
import React, { useState, useEffect, useMemo } from 'react';
import { styled, Text, XStack, YStack } from 'tamagui';
import { makeRows } from '@/utils/misc';
import AspectImage from '@/components/images/AspectImage';
import { useCarousel } from '@/contexts/CarouselContext';
import { FADE_SHORT } from '@/config/constants';

const COLUMNS = 1; // Define the number of columns here
const FONT_PERCENTAGE = 0.16;
const SPACING_PERCENTAGE = 0.2;

const DisplayContainer = styled(YStack, {
    name: 'DisplayContainer',
    justifyContent: 'flex-start', // Ensure columns are spaced
    alignItems: 'flex-start',
    flex: 1,
});

const Row = styled(XStack, {
    name: 'Row',
    alignItems: 'center',
    justifyContent: 'flex-start',
});

interface SelectedWorkDisplayProps {
    houses: House[];
    width: number;
    verticalGap: number;
    horizontalGap?: number;
}

const Container = styled(YStack, {
    name: 'Container',
    justifyContent: 'flex-end',
    style: {
        transition: FADE_SHORT
    }
});

const BodyContainer = styled(YStack, {
    name: 'BodyContainer',
    justifyContent: 'flex-start'
});

const TextContainer = styled(YStack, {
    name: 'TextContainer',
    justifyContent: 'center',
})

const AddressText = styled(Text, {
    name: 'AddressText',
    fontFamily: '$sc',
    fontWeight: 700,
    color: '$darkGray',
    textAlign: 'right',
    paddingRight: '5%',
});

type SelectedWorkHouseProps = {
    house: House;
    width: number;
    bodyHeight: number;
    textHeight: number;
    onClick?: () => void;
}

const SelectedWorkHouse: React.FC<SelectedWorkHouseProps> = ({ house, width, bodyHeight, textHeight, onClick }) => {
    const [opacity, setOpacity] = useState(0);

    const handleOnDimensions = () => {
        setOpacity(1);
    }

    return (
        <Container
            opacity={opacity}>
            <BodyContainer height={bodyHeight}>
                <AspectImage
                    src={house.mainImage}
                    width={width}
                    alt={house.address}
                    onClick={onClick}
                    onDimensions={() => setOpacity(1)}
                />
            </BodyContainer>
            <TextContainer height={textHeight}>
                <AddressText
                    fontSize={textHeight * FONT_PERCENTAGE}
                    letterSpacing={textHeight * FONT_PERCENTAGE * SPACING_PERCENTAGE}
                >{house.address}</AddressText>
            </TextContainer>
        </Container>
    );
};

const SelectedWorkDisplay: React.FC<SelectedWorkDisplayProps> = ({ houses, width, verticalGap, horizontalGap = 100 }) => {
    const { createOnClick } = useCarousel();
    const [heights, setHeights] = useState<number[]>([]);

    const rows = useMemo(() => makeRows(houses, COLUMNS), [houses]);

    useEffect(() => {
        let isMounted = true;

        const loadMaxHeights = async () => {
            const maxHeights = await Promise.all(rows.map(row => calculateMaxHeight(row, width)));

            if (isMounted) {
                setHeights(maxHeights);
            }
        };

        loadMaxHeights();

        return () => {
            isMounted = false;
        };
    }, [rows, width]);

    return (
        <DisplayContainer>
            {rows.map((row, rowIndex) => (
                <Row
                    key={rowIndex}
                    gap={horizontalGap}
                >

                    {row.map((house, houseIndex) => (
                        <SelectedWorkHouse key={houseIndex}
                            house={house}
                            width={width}
                            bodyHeight={heights[rowIndex]}
                            textHeight={verticalGap}
                            onClick={createOnClick(house)}
                        />
                    ))}
                </Row>
            ))}
        </DisplayContainer>
    );
};

export default SelectedWorkDisplay;