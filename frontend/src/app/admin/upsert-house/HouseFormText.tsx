import React, { useMemo, useState } from 'react';
import { View, Input, Label, styled, Button } from 'tamagui';
import { House } from 'living-mile-high-lib';

const TextContainer = styled(View, {
    marginBottom: 15,
});

const FormLabelContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

const FormLabelText = styled(Label, {
    marginBottom: 5,
    fontWeight: 'bold',
});

const TextInput = styled(Input, {
    flex: 1,
});

const Row = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // Necessary for absolute positioning the dropdown
});

const DropdownButton = styled(Button, {
    marginRight: 10,
    padding: 0,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
});

const DropdownList = styled(View, {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1,
});

const DropdownItem = styled(Button, {
    padding: 10,
    alignItems: 'center',
});

type HouseFormTextProps = {
    formData: House;
    setFormData: React.Dispatch<React.SetStateAction<House>>;
    houses: House[];
};

const isNeighborhoodValid = (neighborhood: string | undefined) => neighborhood !== undefined && neighborhood !== '';

const HouseFormText: React.FC<HouseFormTextProps> = ({ formData, setFormData, houses }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const uniqueNeighborhoods = useMemo(() => {
        const validNeighborhoods: string[] = houses.map(house => house.neighborhood).filter(isNeighborhoodValid) as string[];
        return Array.from(new Set(validNeighborhoods));
    }, [houses]);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownSelect = (neighborhood: string) => {
        handleInputChange('neighborhood', neighborhood);
        setIsDropdownOpen(false);
    };

    const handleInputChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <TextContainer>
            <FormLabelContainer>
                <FormLabelText>Address</FormLabelText>
            </FormLabelContainer>
            <TextInput
                value={formData.address}
                onChange={(e: any) => handleInputChange('address', e.nativeEvent.text)}
            />

            <FormLabelContainer>
                <FormLabelText>Neighborhood</FormLabelText>
            </FormLabelContainer>

            <Row>
                <DropdownButton onPress={handleDropdownToggle}>▼</DropdownButton>
                <TextInput
                    value={formData.neighborhood}
                    onChange={(e: any) => handleInputChange('neighborhood', e.nativeEvent.text)}
                />
                {isDropdownOpen && (
                    <DropdownList>
                        {uniqueNeighborhoods.map((neighborhood) => (
                            <DropdownItem key={neighborhood} onPress={() => handleDropdownSelect(neighborhood)}>
                                {neighborhood}
                            </DropdownItem>
                        ))}
                    </DropdownList>
                )}
            </Row>
        </TextContainer>
    );
};

export default HouseFormText;