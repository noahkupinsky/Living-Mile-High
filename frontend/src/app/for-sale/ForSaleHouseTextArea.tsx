import { STAT_TEMPLATES } from '@/config/constants';
import { House } from 'living-mile-high-lib';
import React from 'react';
import { styled, Text, View } from 'tamagui';

const Container = styled(View, {
    name: 'Container',
    marginLeft: 20,
    justifyContent: 'center',
});

const AddressText = styled(Text, {
    name: 'AddressText',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
});

const StatText = styled(Text, {
    name: 'StatText',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 10,
});

interface ForSaleHouseTextAreaProps {
    width: number
    house: House;
}

const ForSaleHouseTextArea: React.FC<ForSaleHouseTextAreaProps> = ({ house, width }) => {
    const { address, neighborhood, stats } = house;


    const renderStats = () => {
        return STAT_TEMPLATES.map(([key, template]) => {
            if (stats[key] !== undefined) {
                return (
                    <StatText key={key}>
                        {template.replace('$', stats[key].toString())}
                    </StatText>
                );
            }
            return null;
        });
    };

    return (
        <Container style={{ width }}>
            <AddressText>{`${address} | ${neighborhood}`}</AddressText>
            {renderStats()}
        </Container>
    );
};

export default ForSaleHouseTextArea;