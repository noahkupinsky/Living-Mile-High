import React from 'react';
import { View, Text, Label, Switch, styled, XStack, Input } from 'tamagui';
import { House, HouseBoolean } from 'living-mile-high-lib';
import Pages from '@/config/pageConfig';

const ClassificationContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
});

const ClassificationLabelContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

const ClassificationLabel = styled(Label, {
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

const SmallText = styled(Text, {
    textAlign: 'center',
    fontSize: 10,
    color: '$darkGray',
})

type HouseFormClassificationProps = {
    formData: House;
    setFormData: React.Dispatch<React.SetStateAction<House>>;
};

const HOUSE_BOOLEAN_LABELS: { [key in HouseBoolean]: string } = {
    isForSale: Pages.FOR_SALE.name,
    isSelectedWork: Pages.SELECTED_WORK.name,
    isDeveloped: Pages.DEVELOPED.name,
}

const HouseFormClassification: React.FC<HouseFormClassificationProps> = ({ formData, setFormData }) => {

    const toggleBoolean = (key: keyof House) => {
        setFormData(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePriorityChange = (value: string) => {
        const parsedValue = parseInt(value);
        const newPriority = !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
        setFormData(prev => ({ ...prev, priority: newPriority }));
    }

    return (
        <ClassificationContainer>
            <ClassificationLabelContainer>
                <ClassificationLabel>Booleans</ClassificationLabel>
            </ClassificationLabelContainer>
            <SmallText>{`(All houses NOT For Sale will be shown on ${Pages.SOLD.name})`}</SmallText>
            {(Object.entries(HOUSE_BOOLEAN_LABELS) as [HouseBoolean, string][]).map(([key, label]) => (
                <BooleanRow key={key}>
                    <FormLabel>{`${label}?`}</FormLabel>
                    <Switch
                        checked={formData[key]}
                        backgroundColor={formData[key] ? 'lightgreen' : 'tomato'}
                        onCheckedChange={() => toggleBoolean(key as keyof House)}>
                        <Switch.Thumb />
                    </Switch>
                </BooleanRow>
            ))}
            <ClassificationLabelContainer>
                <ClassificationLabel>Priority</ClassificationLabel>
            </ClassificationLabelContainer>
            <SmallText>{`(Priority 1 goes first, then 2, 3, etc.)`}</SmallText>
            <XStack
                justifyContent='space-between'
                marginBottom={5}>
                <Label>{'Priority:'}</Label>
                <Input
                    value={formData.priority?.toString() ?? ''}
                    onChangeText={handlePriorityChange}
                    width={80} />
            </XStack>
        </ClassificationContainer>
    );
};

export default HouseFormClassification;