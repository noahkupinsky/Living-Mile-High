'use client'

import React from 'react';
import { styled, View } from 'tamagui';

const Container = styled(View, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const HorizontalLine: React.FC<{ width: string, height: string, color: string }> = ({ width, height, color }) => {
    return (
        <Container style={{ height: height, width: '100%' }}>
            <View
                backgroundColor={color}
                width={width}
                height={'2px'}
            />
        </Container>
    );
};

export default HorizontalLine;