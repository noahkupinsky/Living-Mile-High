import React from 'react';
import { View, Label, Switch, styled } from 'tamagui';
import { House, HouseBoolean } from 'living-mile-high-lib';
import { FormDataHouse } from '@/types';

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

type HouseFormBooleansProps = {
    formData: FormDataHouse;
    setFormData: React.Dispatch<React.SetStateAction<FormDataHouse>>;
};

const HOUSE_BOOLEAN_LABELS: Record<HouseBoolean, string> = {
    isDeveloped: 'Is Developed?',
    isForSale: 'Is For Sale?',
    isSelectedWork: 'Is Selected Work?',
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
            {(Object.entries(HOUSE_BOOLEAN_LABELS) as [HouseBoolean, string][]).map(([key, label]) => (
                <BooleanRow key={key}>
                    <FormLabel>{label}</FormLabel>
                    <Switch
                        checked={formData[key]}
                        onCheckedChange={() => toggleBoolean(key as keyof House)}>
                        <Switch.Thumb />
                    </Switch>
                </BooleanRow>
            ))}
        </BooleanContainer>
    );
};

export default HouseFormBooleans;