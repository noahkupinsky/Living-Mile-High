import React, { useEffect, useState } from 'react';
import { View, Button, styled } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';
import services from '@/di';
import { FormDataHouse, ImageFormat } from '@/types';
import { House } from 'living-mile-high-lib';
import HouseFormBooleans from './HouseFormBooleans';
import HouseFormStats from './HouseFormStats';
import HouseFormImages from './HouseFormImages';
import HouseFormText from './HouseFormText';

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
    const [formData, setFormData] = useState<FormDataHouse>(house ? house : {
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
        if (house) {
            setFormData(house);
        }
    }, [house]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const processImage = async (image: ImageFormat): Promise<string | undefined> => {
        if (typeof image === 'string') {
            return image;
        }
        try {
            const uploadedUrl = await apiService.uploadAsset(image);
            return uploadedUrl;
        } catch (e) {
            alert(`Failed to save image. ${e}`);
            return undefined;
        }
    }

    const handleFormSubmit = async () => {
        const unfilteredProcessedImages = await Promise.all(formData.images.map(async image => await processImage(image)));
        const processedImages = unfilteredProcessedImages.filter(image => image !== undefined) as string[];
        const processedMainImage = await processImage(formData.mainImage);

        if (!processedMainImage) {
            alert('Failed to save main image. Aborting submission.');
            return;
        }

        const isUpdate = formData.id !== undefined;
        const finalData = {
            ...formData,
            mainImage: processedMainImage,
            images: processedImages
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