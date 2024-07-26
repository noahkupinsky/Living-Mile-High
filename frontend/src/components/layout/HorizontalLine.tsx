'use client'

import { useResize } from '@/contexts/ResizeContext';
import React, { useEffect, useState } from 'react';
import { styled, View } from 'tamagui';

const Container = styled(View, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

function getHeightValue(heightString: string, windowHeight: number): string {
    if (heightString.endsWith('%')) {
        const actualHeight = Math.round(windowHeight * parseFloat(heightString) / 100);
        return `${actualHeight}px`;
    } else {
        return heightString;
    }
}

const HorizontalLine: React.FC<{ width: string, height: string, color: string }> = ({ width, height, color }) => {
    const { hasDimensions, height: windowHeight } = useResize();
    const [heightValue, setHeightValue] = useState('0px');

    useEffect(() => {
        setHeightValue(getHeightValue(height, windowHeight));
    }, [height, windowHeight]);

    console.log(heightValue);

    return (
        <Container style={{ height: heightValue, width: '100%' }}>
            <View
                backgroundColor={color}
                width={width}
                height={'2px'}
            />
        </Container>
    );
};

export default HorizontalLine;