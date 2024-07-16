import { useState, useEffect } from "react";
import { styled, Image } from "tamagui";

export const StyledImage = styled(Image, {
    name: 'StyledImage',
});

export const AutoImage = ({ src, alt, ...props }: any) => {
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