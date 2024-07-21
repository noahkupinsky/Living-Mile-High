import React, { useState } from 'react';
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

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <FormLabelContainer>
        <FormLabelText>{children}</FormLabelText>
    </FormLabelContainer>
)

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
    border: '1px solid #ccc',
    borderRadius: 5,
    zIndex: 1,
});

const DropdownItem = styled(Button, {
    padding: 10,
    textalign: 'center',
});

type HouseFormTextProps = {
    formData: House;
    setFormData: React.Dispatch<React.SetStateAction<House>>;
    houses: House[];
};

const HouseFormText: React.FC<HouseFormTextProps> = ({ formData, setFormData, houses }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const uniqueNeighborhoods = Array.from(new Set(houses.map(house => house.neighborhood)));

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
            <FormLabel>Address</FormLabel>
            <TextInput
                value={formData.address}
                onChange={(e: any) => handleInputChange('address', e.nativeEvent.text)}
            />

            <FormLabel>Neighborhood</FormLabel>
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