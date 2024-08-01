'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image, styled, View } from 'tamagui';
import { FADE_MEDIUM } from '@/config/constants';
import { requestAnimationFrames } from '@/utils/misc';

type AspectImageProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    onDimensions?: (dimensions: { width: number; height: number }) => void;
    noFade?: boolean;
    [key: string]: any;
};

const Container = styled(View, {
    style: {
        transition: FADE_MEDIUM,
    }
});

const AspectImage: React.FC<AspectImageProps> = ({ noFade, src, width, height, alt, onClick, onDimensions, ...props }) => {
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
        };
    }, [src, width, height]);

    useEffect(() => {
        calculateDimensions();
    }, [calculateDimensions]);

    useEffect(() => {
        if (onDimensions && dimensions) {
            onDimensions(dimensions);
        }
    }, [dimensions, onDimensions]);

    useEffect(() => {
        requestAnimationFrames(() => setOpacity(1));
    }, []);

    if (!dimensions) {
        return null;
    }

    return (
        <Container
            opacity={opacity}
            onPress={onClick}
            cursor={onClick ? 'pointer' : 'auto'}
        >
            <Image
                source={{ uri: src, width: dimensions.width, height: dimensions.height }}
                alt={alt}
                {...props}
            />
        </Container>
    );
};

export default AspectImage;