'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ClickableImage from './ClickableImage';
import { styled, View } from 'tamagui';

type AspectImageProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    noFade?: boolean;
    [key: string]: any;
};

const Container = styled(View, {
    width: '100%',
    height: '100%',
});

const AspectImage: React.FC<AspectImageProps> = ({ noFade, src, width, height, alt, onClick, ...props }) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [opacity, setOpacity] = useState(noFade ? 1 : 0);

    const calculateDimensions = useCallback(() => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
            const aspectRatio = img.width / img.height;

            let calculatedWidth = width;
            let calculatedHeight = height;

            if (calculatedWidth && calculatedHeight) {
                const heightDeterminedWidth = calculatedHeight * aspectRatio;
                const widthDeterminedHeight = calculatedWidth / aspectRatio;
                const minWidth = Math.min(calculatedWidth, heightDeterminedWidth);
                const minHeight = Math.min(calculatedHeight, widthDeterminedHeight);
                setDimensions({ width: minWidth, height: minHeight });
            } else if (calculatedWidth) {
                setDimensions({ width: calculatedWidth, height: calculatedWidth / aspectRatio });
            } else if (calculatedHeight) {
                setDimensions({ width: calculatedHeight * aspectRatio, height: calculatedHeight });
            } else {
                setDimensions({ width: img.width, height: img.height });
            }

            if (opacity === 0) {
                setTimeout(() => {
                    setOpacity(1);
                }, 50);
            }
        };
    }, [src, width, height]);

    useEffect(() => {
        calculateDimensions();
    }, [src, width, height]);

    if (!dimensions) {
        return null; // or a loading spinner
    }

    return (
        <Container
            opacity={opacity}
            style={{
                transition: 'opacity 0.5s ease-in-out',
            }}
        >
            <ClickableImage
                source={{ uri: src, width: dimensions.width, height: dimensions.height }}
                alt={alt}
                {...props}
                onClick={onClick}
            />
        </Container>
    );
};

export default AspectImage;