'use client'

import { useState, useEffect } from "react";
import { Image, View } from "tamagui";

type AutoImageProps = {
    src: string;
    alt: string;
    onClick?: () => void;
    [key: string]: any;
}

export const AutoImage: React.FC<AutoImageProps> = ({ src, alt, onClick, ...props }) => {
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
        <Image
            source={{ uri: src, width: dimensions.width, height: dimensions.height }}
            alt={alt}
            onPress={onClick}
            {...props}
        />
    );
}