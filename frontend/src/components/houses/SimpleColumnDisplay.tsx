import React, { useEffect, useMemo, useState } from 'react';
import { styled, XStack, YStack } from 'tamagui';
import { House } from 'living-mile-high-lib';
import { useSizing } from '@/contexts/SizingContext';
import { calculateMaxHeight } from '@/utils/houseRendering';
import { makeRows } from '@/utils/misc';
import SimpleHouseDisplay from './SimpleHouseDisplay';
import { HouseOnClickCreator } from '@/types';

const WIDTH_PERCENTAGE = 0.7;
const GAP_PERCENTAGE = 0.2;
const IDEAL_COLUMN_WIDTH = 300;

const ColumnContainer = styled(YStack, {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
})

const Row = styled(XStack, {
    justifyContent: 'flex-start',
});

interface SimpleColumnDisplayProps {
    houses: House[];
    maxColumns: number;
    minColumns: number;
    createOnClick?: HouseOnClickCreator;
}

const SimpleColumnDisplay: React.FC<SimpleColumnDisplayProps> = ({ houses, createOnClick, maxColumns, minColumns }) => {
    const { bodyWidth, bodyHeight } = useSizing();
    const [heights, setHeights] = useState<number[]>([]);

    const columns = useMemo(() =>
        Math.max(
            Math.min(
                Math.ceil(bodyWidth * WIDTH_PERCENTAGE / IDEAL_COLUMN_WIDTH),
                maxColumns
            ),
            minColumns
        ),
        [bodyWidth, minColumns, maxColumns]
    );

    const rows = useMemo(() => makeRows(houses, columns), [houses, columns]);

    const width = useMemo(() => bodyWidth * WIDTH_PERCENTAGE / columns, [bodyWidth, columns]);

    useEffect(() => {
        let isMounted = true;

        const loadMaxHeights = async () => {
            const maxHeights = await Promise.all(rows.map(row => calculateMaxHeight(row, width)));

            if (isMounted) {
                setHeights(maxHeights);
            }
        };

        loadMaxHeights();

        return () => {
            isMounted = false;
        };
    }, [rows, width]);



    const verticalGap = useMemo(() => bodyHeight * GAP_PERCENTAGE / columns, [bodyHeight, columns]);

    return (
        <ColumnContainer>
            {rows.map((row, rowIndex) => (
                <Row key={rowIndex} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    {row.map((house) => (
                        <SimpleHouseDisplay
                            key={house.id!}
                            house={house}
                            width={width}
                            onClick={createOnClick ? createOnClick(house) : undefined}
                            verticalGap={verticalGap}
                            height={heights[rowIndex]} />
                    ))}
                </Row>
            ))}
        </ColumnContainer>
    );
};

export default SimpleColumnDisplay;