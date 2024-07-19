import { House } from 'living-mile-high-lib';
import React, { useState, useEffect } from 'react';
import { View } from 'tamagui';
import SimpleHouseDisplay from './SimpleHouseDisplay';
import { calculateMaxHeight } from '@/utils/houseRendering';
import Loader from '@/components/layout/Loader';

interface SimpleRowContainerProps {
    houses: House[];
    width: number;
}

const SimpleRowContainer: React.FC<SimpleRowContainerProps> = ({ houses, width }) => {
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        let isMounted = true;

        const loadMaxHeight = async () => {
            const maxHeight = await calculateMaxHeight(houses, width);
            if (isMounted) {
                setMaxHeight(maxHeight);
            }
        };

        loadMaxHeight();

        return () => {
            isMounted = false;
        };
    }, [houses, width]);

    return (
        <Loader isLoading={maxHeight === undefined}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {houses.map((house) => (
                    <SimpleHouseDisplay key={house.id} house={house} width={width} height={maxHeight} />
                ))}
            </View>
        </Loader>
    );
};

export default SimpleRowContainer;