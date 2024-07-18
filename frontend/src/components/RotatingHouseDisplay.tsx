"use client";
import React, { useState, useEffect } from 'react';
import { Stack, Text } from 'tamagui';
import { AutoImage } from './images/AutoImage';
import { useHouseQuery } from '@/contexts/HouseQueryContext';

export type RotatingHouseDisplayProps = {
    interval: number
}

const RotatingHouseDisplay = ({ interval }: RotatingHouseDisplayProps) => {
    const { houses } = useHouseQuery();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % houses.length);
        }, interval);

        return () => clearInterval(timer);
    }, [houses, interval]);

    const currentHouse = houses[currentIndex];

    return (
        <Stack
            backgroundColor="666333"
            width="100%"
            height={600}
            alignItems="center"
            justifyContent="center"
            padding={20}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={8}
        >
            {houses.length > 0 ? (
                <>
                    <AutoImage
                        src={currentHouse.mainImage}
                        alt={"Failed to load"}
                    />
                    <Stack marginTop={20} alignItems="center">
                        <Text fontSize={24} color="$color">
                            {currentHouse.address}
                        </Text>
                        <Text fontSize={16} color="$color">
                            {currentHouse.neighborhood}
                        </Text>
                    </Stack>
                </>
            ) : null}
        </Stack>
    );
};

export default RotatingHouseDisplay;