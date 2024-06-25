"use client";
import React, { useState, useEffect } from 'react';
import { useHouseContext } from './HouseContext';
import { Stack, Text, Image, styled } from 'tamagui';

export type RotatingHouseDisplayProps = {
    interval: number
}

const StyledImage = styled(Image, {
    name: 'StyledImage',
});

export function AutoImage({ src, alt, ...props }: any) {
    const [dimensions, setDimensions] = useState<any>({ width: 'auto', height: 'auto' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                setDimensions({ width: img.width, height: img.height });
            };
        }
    }, [src]);

    return (
        <StyledImage
            source={{ uri: src, width: dimensions.width, height: dimensions.height }}
            alt={alt}
            {...props}
        />
    );
}

const RotatingHouseDisplay = ({ interval }: RotatingHouseDisplayProps) => {
    const { houses } = useHouseContext();
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
            <AutoImage
                src={"http://localhost:9000/miniocdn/home-first"}
                alt={"Couldn't load home first"}
            />
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