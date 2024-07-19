import React from 'react';
import { View } from 'tamagui';
import { House } from 'living-mile-high-lib';
import SimpleRowContainer from './SimpleRowContainer';

interface SimpleColumnDisplayProps {
    houses: House[];
    columns: number;
    width: number;
}

const SimpleColumnDisplay: React.FC<SimpleColumnDisplayProps> = ({ houses, columns, width }) => {
    const rows = [];
    for (let i = 0; i < houses.length; i += columns) {
        rows.push(houses.slice(i, i + columns));
    }

    return (
        <View>
            {rows.map((row, rowIndex) => (
                <SimpleRowContainer key={rowIndex} width={width} houses={row} />
            ))}
        </View>
    );
};

export default SimpleColumnDisplay;