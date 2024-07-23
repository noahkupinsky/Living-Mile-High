import React, { useEffect, useState } from 'react';
import { View, Button, styled } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';
import { House } from 'living-mile-high-lib';
import HouseFormBooleans from './HouseFormBooleans';
import HouseFormStats from './HouseFormStats';
import HouseFormImages from './HouseFormImages';
import HouseFormText from './HouseFormText';
import services from '@/di';
import { objectsEqualTimestampless } from '@/utils/misc';

const FormContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    backgroundColor: 'white',
});

const ColumnsContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
})

const LeftColumn = styled(View, {
    flex: 1,
    width: 400,
    marginRight: 20,
});

const RightColumn = styled(View, {
    width: 300,
    flex: 1,
});

const HouseForm: React.FC<{ house?: House }> = ({ house }) => {
    const { apiService } = services();
    const { houses } = useSiteData();
    const [formData, setFormData] = useState<House>(house ? house : {
        isDeveloped: false,
        isForSale: false,
        isSelectedWork: false,
        address: '',
        mainImage: '',
        images: [],
        neighborhood: '',
        stats: {},
    });

    useEffect(() => {
        const newHouse = houses.find(house => house.id === formData.id);
        if (!newHouse) {
            return;
        }
        if (!objectsEqualTimestampless(newHouse, formData)) {
            alert('House update detected. Repopulating house form...');
        }
        setFormData(newHouse);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [houses]);

    const handleFormSubmit = async () => {
        const isUpdate = formData.id !== undefined;
        const finalData = {
            ...formData
        };
        try {
            const id = await apiService.upsertHouse(finalData);
            setFormData(prev => ({ ...prev, id }));
            alert(
                isUpdate ? `House updated successfully` : `House created successfully`
            );
        } catch (error) {
            alert('An error occurred while submitting the form. Please try again.');
        }
    };

    return (
        <FormContainer>
            <ColumnsContainer>
                <LeftColumn>
                    <HouseFormText formData={formData} setFormData={setFormData} houses={houses} />
                    <HouseFormImages
                        formData={formData}
                        setFormData={setFormData}
                    />
                </LeftColumn>
                <RightColumn>
                    <HouseFormStats formData={formData} setFormData={setFormData} />
                    <HouseFormBooleans formData={formData} setFormData={setFormData} />
                </RightColumn>
            </ColumnsContainer>
            <Button onPress={handleFormSubmit}>Submit</Button>
        </FormContainer>
    );
};

export default HouseForm;