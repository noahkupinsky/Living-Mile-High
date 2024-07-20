'use client'

import React, { useState, useEffect } from 'react';
import { styled, Image } from 'tamagui';

const StyledImage = styled(Image, {
    name: 'StyledImage',
});

type AspectImageProps = {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
};

const AspectImage: React.FC<AspectImageProps> = ({ src, width, height, alt, onClick, ...props }) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        if (width && height) {
            throw new Error('AspectImage cannot have both width and height.');
        }

        const img = new window.Image();
        img.src = src;
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            if (width) {
                setDimensions({ width, height: width / aspectRatio });
            } else if (height) {
                setDimensions({ width: height * aspectRatio, height });
            } else {
                setDimensions({ width: img.width, height: img.height });
            }
        };
    }, [src, width, height]);

    if (!dimensions) {
        return null; // or a loading spinner
    }

    return (
        <StyledImage
            source={{ uri: src, width: dimensions.width, height: dimensions.height }}
            alt={alt}
            {...props}
            onClick={onClick}
        />
    );
};

export default AspectImage;