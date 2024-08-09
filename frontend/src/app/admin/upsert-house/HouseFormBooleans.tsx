import React from 'react';
import { View, Text, Label, Switch, styled } from 'tamagui';
import { House, HouseBoolean } from 'living-mile-high-lib';

const BooleanContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
});

const BooleansLabelContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

const BooleansLabel = styled(Label, {
    marginBottom: 5,
    fontWeight: 'bold',
});

const FormLabel = styled(Label, {
    marginBottom: 5,
});

const BooleanRow = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
});

const BooleanText = styled(Text, {
    textAlign: 'center',
    fontSize: 10,
    color: '$darkGray',
})

type HouseFormBooleansProps = {
    formData: House;
    setFormData: React.Dispatch<React.SetStateAction<House>>;
};

const HOUSE_BOOLEAN_LABELS: Record<HouseBoolean, string> = {
    isForSale: 'Projects For Sale?',
    isSelectedWork: 'Featured?',
    isDeveloped: 'Our Work?',
}

const HouseFormBooleans: React.FC<HouseFormBooleansProps> = ({ formData, setFormData }) => {

    const toggleBoolean = (key: keyof House) => {
        setFormData(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <BooleanContainer>
            <BooleansLabelContainer>
                <BooleansLabel>Booleans</BooleansLabel>
            </BooleansLabelContainer>
            <BooleanText>{'(All houses NOT For Sale will be shown on Real Estate Sales)'}</BooleanText>
            {(Object.entries(HOUSE_BOOLEAN_LABELS) as [HouseBoolean, string][]).map(([key, label]) => (
                <BooleanRow key={key}>
                    <FormLabel>{label}</FormLabel>
                    <Switch
                        checked={formData[key]}
                        backgroundColor={formData[key] ? 'lightgreen' : 'tomato'}
                        onCheckedChange={() => toggleBoolean(key as keyof House)}>
                        <Switch.Thumb />
                    </Switch>
                </BooleanRow>
            ))}
        </BooleanContainer>
    );
};

export default HouseFormBooleans;