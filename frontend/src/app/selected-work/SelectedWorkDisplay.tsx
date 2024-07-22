import { calculateMaxHeight } from '@/utils/houseRendering';
import { House } from 'living-mile-high-lib';
import React, { useState, useEffect } from 'react';
import { styled, View } from 'tamagui';
import SelectedWorkHouse from './SelectedWorkHouse';
import Loader from '@/components/layout/Loader';

const DisplayContainer = styled(View, {
    name: 'DisplayContainer',
    flexDirection: 'row',
    justifyContent: 'center', // Ensure columns are spaced
    width: '100%',
});

const Column = styled(View, {
    name: 'Column',
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 100, // Add constant space between columns
});

interface SelectedWorkDisplayProps {
    houses: House[];
    width: number;
    onClick: (house: House) => void;
}

const SelectedWorkDisplay: React.FC<SelectedWorkDisplayProps> = ({ houses, width, onClick }) => {
    const [heights, setHeights] = useState<number[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadMaxHeights = async () => {
            const numRows = Math.ceil(houses.length / 2);
            const rowHeights: number[] = [];

            for (let i = 0; i < numRows; i++) {
                const rowHouses = houses.slice(i * 2, i * 2 + 2);
                const height = await calculateMaxHeight(rowHouses, width);
                rowHeights.push(height);
            }

            if (isMounted) {
                setHeights(rowHeights);
            }
        };

        loadMaxHeights();

        return () => {
            isMounted = false;
        };
    }, [houses, width]);

    const leftColumnHouses = houses.filter((_, index) => index % 2 === 0);
    const rightColumnHouses = houses.filter((_, index) => index % 2 !== 0);

    return (
        <Loader isLoading={heights.length === 0}>
            <DisplayContainer>
                <Column style={{ width: width }}>
                    {leftColumnHouses.map((house, index) => (
                        <SelectedWorkHouse
                            key={house.id}
                            house={house}
                            height={heights[index]}
                            width={width}
                            onClick={onClick}
                        />
                    ))}
                </Column>
                <Column style={{ width: width }}>
                    {rightColumnHouses.map((house, index) => (
                        <SelectedWorkHouse
                            key={house.id}
                            house={house}
                            height={heights[index]}
                            width={width}
                            onClick={onClick}
                        />
                    ))}
                </Column>
            </DisplayContainer>
        </Loader>
    );
};

export default SelectedWorkDisplay;