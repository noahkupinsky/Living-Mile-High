import React from 'react';
import { View, Label, Input, styled } from 'tamagui';
import { House, HouseStats } from 'living-mile-high-lib';

const StatsContainer = styled(View, {
    marginBottom: 15,
});

const StatsLabelContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

const StatsLabel = styled(Label, {
    marginBottom: 5,
    fontWeight: 'bold',
});

const FormLabel = styled(Label, {
    marginBottom: 5,
});

const StatRow = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
});

const StatInput = styled(Input, {
    width: 100,
});

type HouseFormStatsProps = {
    formData: House;
    setFormData: React.Dispatch<React.SetStateAction<House>>;
};

const HOUSE_STAT_LABELS: Record<keyof HouseStats, string> = {
    houseSquareFeet: 'House Square Feet',
    lotSquareFeet: 'Lot Square Feet',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    garageSpaces: 'Garage Spaces',
}

const HouseFormStats: React.FC<HouseFormStatsProps> = ({ formData, setFormData }) => {
    const handleStatChange = (key: keyof HouseStats, value: string) => {
        setFormData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [key]: value ? Number(value) : undefined
            }
        }));
    };

    return (
        <StatsContainer>
            <StatsLabelContainer>
                <StatsLabel>Stats</StatsLabel>
            </StatsLabelContainer>
            {(Object.entries(HOUSE_STAT_LABELS) as [keyof HouseStats, string][]).map(([key, label]) => (
                <StatRow key={key}>
                    <FormLabel>{label}</FormLabel>
                    <StatInput
                        value={formData.stats[key]?.toString() || ''}
                        onChange={(e: any) => handleStatChange(key as keyof HouseStats, e.nativeEvent.text)}
                    />
                </StatRow>
            ))}
        </StatsContainer>
    );
};

export default HouseFormStats;