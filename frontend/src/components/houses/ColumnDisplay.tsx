import React from 'react';
import { View } from 'tamagui';
import RowContainer from '@/components/houses/RowContainer';;
import { useHouseQuery } from '@/contexts/HouseQueryContext';
import { House } from 'living-mile-high-lib';

interface ColumnDisplayProps {
    columns: number;
    width: number;
    renderHouse: (house: House, width: number, height?: number) => React.ReactNode;
}

const ColumnDisplay: React.FC<ColumnDisplayProps> = ({ columns, width, renderHouse }) => {
    const { houses } = useHouseQuery();
    const rows = [];
    for (let i = 0; i < houses.length; i += columns) {
        rows.push(houses.slice(i, i + columns));
    }

    return (
        <View>
            {rows.map((row, rowIndex) => (
                <RowContainer key={rowIndex} width={width} houses={row} renderHouse={renderHouse} />
            ))}
        </View>
    );
};

export default ColumnDisplay;