import React from 'react';
import { styled, Text, View } from 'tamagui';

const HeaderContainer = styled(View, {
    name: 'HeaderContainer',
    marginVertical: 20,
    alignItems: 'center',
});

const HeaderText = styled(Text, {
    name: 'HeaderText',
    fontSize: 24,
    fontWeight: 'bold',
});

interface NeighborhoodHeaderProps {
    neighborhoods: string[];
}

const NeighborhoodHeader: React.FC<NeighborhoodHeaderProps> = ({ neighborhoods }) => {
    return (
        <HeaderContainer>
            <HeaderText>{neighborhoods.join(' | ').toUpperCase()}</HeaderText>
        </HeaderContainer>
    );
};

export default NeighborhoodHeader;