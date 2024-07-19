import React, { useEffect, useState } from 'react';
import SimpleNeighborhoodHeader from './SimpleNeighborhoodHeader';
import SimpleColumnDisplay from './SimpleColumnDisplay';
import { House } from 'living-mile-high-lib';
import { NEIGHBORHOOD_GROUPS, NEIGHBORHOOD_SORT_ORDER } from '@/config/constants';

interface SimpleNeighborhoodGroupingProps {
    houses: House[];
    width: number;
    columns: number;
}

const compareNeighborhoodGroups = (a: string[], b: string[]): number => {
    const normalizedSortOrder = NEIGHBORHOOD_SORT_ORDER.map(neighborhood => neighborhood.toLowerCase().trim()).reverse();

    const scoreGroup = (group: string[]) => {
        let score = 0;
        for (const neighborhood of group) {
            score += normalizedSortOrder.indexOf(neighborhood);
        }
        const average = score / group.length;
        return average;
    };

    return scoreGroup(b) - scoreGroup(a);
}

const getNeighborhoodGroups = (houses: House[]): string[][] => {
    const normalizedNeighborhoodGroups = NEIGHBORHOOD_GROUPS.map(group => group.map(neighborhood => neighborhood.toLowerCase().trim()));
    // create set for easily checking if the neighborhood belongs in a group at all
    const groupedNeighborhoodsSet = new Set(normalizedNeighborhoodGroups.flat());
    // create set for all neighborhoods found in the passed in houses
    const allNeighborhoodsSet = new Set(houses.map(house => house.neighborhood.toLowerCase().trim()));
    // prepare to fill out groups from found neighborhoods
    const groups: string[][] = Array.from({ length: normalizedNeighborhoodGroups.length }, () => []);

    for (const neighborhood of allNeighborhoodsSet) {
        if (groupedNeighborhoodsSet.has(neighborhood)) {
            for (const [i, group] of normalizedNeighborhoodGroups.entries()) {
                if (group.includes(neighborhood)) {
                    groups[i].push(neighborhood);
                }
            }
        } else {
            groups.push([neighborhood]);
        }
    }

    const nonEmptyGroups = groups.filter(group => group.length > 0);

    const sortedGroups = nonEmptyGroups.sort(compareNeighborhoodGroups);

    return sortedGroups;
}

const SimpleNeighborhoodGrouping: React.FC<SimpleNeighborhoodGroupingProps> = ({ houses, width, columns }) => {
    const [groups, setGroups] = useState(getNeighborhoodGroups(houses));

    useEffect(() => {
        setGroups(getNeighborhoodGroups(houses));
    }, [houses]);

    return (
        <div>
            {groups.map((group, index) => {
                const filteredHouses = houses.filter(house => group.includes(house.neighborhood.toLowerCase()));
                return (
                    <div key={index}>
                        <SimpleNeighborhoodHeader neighborhoods={group} />
                        <SimpleColumnDisplay houses={filteredHouses} width={width} columns={columns} />
                    </div>
                );
            })}
        </div>
    );
};

export default SimpleNeighborhoodGrouping;