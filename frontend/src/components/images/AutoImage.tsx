'use client'

import { useState, useEffect } from "react";
import ClickableImage from "./ClickableImage";

type AutoImageProps = {
    src: string;
    alt: string;
    onClick?: () => void;
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
        <ClickableImage
            source={{ uri: src, width: dimensions.width, height: dimensions.height }}
            alt={alt}
            onClick={onClick}
            {...props}
        />
    );
}