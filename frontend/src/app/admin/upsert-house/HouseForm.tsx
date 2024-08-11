import React, { useEffect, useState } from 'react';
import { View, Button, styled } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';
import { House } from 'living-mile-high-lib';
import HouseFormClassification from './HouseFormClassification';
import HouseFormStats from './HouseFormStats';
import HouseFormImages from './HouseFormImages';
import HouseFormText from './HouseFormText';
import services from '@/di';
import { objectsEqualTimestampless } from '@/utils/misc';
import { useAlert } from '@/contexts/AlertContext';
import { Alert, AlertTitle } from '@/types';
import { useServices } from '@/contexts/ServiceContext';

const FormContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
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

function validateForm(formData: House): string[] {
    const errors = [];

    if (!formData.address) {
        errors.push('Address is required');
    }

    if (!formData.mainImage) {
        errors.push('Main image is required');
    }

    return errors;
}

const HouseForm: React.FC<{ house?: House }> = ({ house }) => {
    const { withAlertAsync, withAlertSync } = useAlert();
    const { apiService } = useServices();
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
        withAlertSync(() => {
            const newHouse = houses.find(house => house.id === formData.id);

            if (!newHouse) return null;

            const noUpdate = objectsEqualTimestampless(newHouse, formData);

            setFormData(newHouse);

            return noUpdate ? null : new Alert(AlertTitle.WARNING, 'House update detected. Refreshing form data...');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [houses]);

    const handleFormSubmit = async () => {
        const isUpdate = formData.id !== undefined;

        await withAlertAsync(async () => {
            const errors = validateForm(formData);

            if (errors.length > 0) {
                const errorString = errors.join('\n');
                return new Alert(AlertTitle.ERROR, errorString);
            }

            try {
                const id = await apiService.upsertHouse(formData);
                setFormData(prev => ({ ...prev, id }));
                const alertMessage = isUpdate ? `House updated successfully` : `House created successfully`
                return new Alert(AlertTitle.SUCCESS, alertMessage);
            } catch (error) {
                return new Alert(AlertTitle.ERROR, `An error occurred: ${error}`);
            }
        })
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
                    <HouseFormClassification formData={formData} setFormData={setFormData} />
                </RightColumn>
            </ColumnsContainer>
            <Button onPress={handleFormSubmit}>Submit</Button>
        </FormContainer>
    );
};

export default HouseForm;