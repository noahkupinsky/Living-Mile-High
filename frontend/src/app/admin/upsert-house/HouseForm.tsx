import React, { useCallback, useEffect, useState } from 'react';
import { View, Button, styled } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';
import { House, SiteData } from 'living-mile-high-lib';
import HouseFormBooleans from './HouseFormBooleans';
import HouseFormStats from './HouseFormStats';
import HouseFormImages from './HouseFormImages';
import HouseFormText from './HouseFormText';
import services from '@/di';
import { SiteUpdateHandler } from '@/types';

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
    const { updateService } = services();
    const { houses, upsertHouse } = useSiteData();
    const [initialHouse, setInitialHouse] = useState<House | undefined>(house);
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleUpdate: SiteUpdateHandler = async (isLocal, siteData) => {
            const newHouse = siteData.houses.find(house => house.id === formData.id);
            if (!newHouse) {
                return;
            }
            if (isLocal) {
                setInitialHouse(newHouse);
            } else {
                if (newHouse !== initialHouse) {
                    alert('House update detected. Repopulating house form...');
                }
            }
            setFormData(newHouse);
        }

        updateService.addUpdateHandler(handleUpdate);

        return () => {
            updateService.removeUpdateHandler(handleUpdate);
        }
    }, [updateService, formData, initialHouse]);

    const handleFormSubmit = async () => {
        const isUpdate = formData.id !== undefined;
        const finalData = {
            ...formData
        };
        try {
            const id = await upsertHouse(finalData);
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
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
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