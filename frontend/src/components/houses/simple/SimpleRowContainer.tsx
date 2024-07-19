import { House } from 'living-mile-high-lib';
import React, { useState, useEffect } from 'react';
import { View } from 'tamagui';
import SimpleHouseDisplay from './SimpleHouseDisplay';

interface SimpleRowContainerProps {
    houses: House[];
    width: number;
}

const SimpleRowContainer: React.FC<SimpleRowContainerProps> = ({ houses, width }) => {
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        let isMounted = true;
        const heights: number[] = [];

        const promises = houses.map((house, index) => {
            return new Promise<void>((resolve) => {
                const img = new window.Image();
                img.src = house.mainImage;
                img.onload = () => {
                    const aspectRatio = img.width / img.height;
                    const height = width / aspectRatio; // Calculate height based on fixed width and aspect ratio
                    heights[index] = height;
                    resolve();
                };
            });
        });

        Promise.all(promises).then(() => {
            if (isMounted) {
                setMaxHeight(Math.max(...heights));
            }
        });

        return () => {
            isMounted = false;
        };
    }, [houses, width]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {houses.map((house) => (
                <SimpleHouseDisplay key={house.id} house={house} width={width} height={maxHeight} />
            ))}
        </View>
    );
};

export default SimpleRowContainer;