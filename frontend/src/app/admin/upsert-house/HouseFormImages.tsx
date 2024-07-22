import React, { useState } from 'react';
import { Button, View, Label, styled } from 'tamagui';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useSiteData } from '@/contexts/SiteDataContext';
import { ImageFormat } from '@/types';
import DraggableImage from '@/components/images/DraggableImage';
import Modal from '@/components/layout/Modal';
import UploadSingleImage from '@/components/images/UploadSingleImage';
import UploadMultipleImages from '@/components/images/UploadMultipleImages';
import AspectImage from '@/components/images/AspectImage';
import { imageFormatToUrl } from '@/utils/misc';
import { House } from 'living-mile-high-lib';
import services from '@/di';

const ImageContainer = styled(View, {
    marginBottom: 15,
});

const ImageList = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
});

const LabelButton = styled(Button, {
    fontWeight: 'bold',
});

const MainImageContainer = styled(View, {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
});

const LabelButtonRow = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
});

type HouseFormImagesProps = {
    formData: House;
    setFormData: React.Dispatch<React.SetStateAction<House>>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HouseFormImages: React.FC<HouseFormImagesProps> = ({
    formData,
    setFormData,
    isModalOpen,
    setIsModalOpen
}) => {
    const { apiService } = services();
    const { generalData } = useSiteData();
    const [uploadType, setUploadType] = useState<'mainImage' | 'images'>('mainImage');

    const deleteImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleMainImageUpload = async (url?: string) => {
        if (url) {
            setFormData(prev => ({ ...prev, mainImage: url }));
        }
        setIsModalOpen(false);
    };

    const handleImagesUpload = async (urls: string[]) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        setIsModalOpen(false);
    };

    const moveImage = (dragIndex: number, hoverIndex: number) => {
        const updatedImages = [...formData.images];
        const [draggedImage] = updatedImages.splice(dragIndex, 1);
        updatedImages.splice(hoverIndex, 0, draggedImage);
        setFormData({ ...formData, images: updatedImages });
    };

    const mainImageUrl = formData.mainImage === '' ? undefined : imageFormatToUrl(formData.mainImage);

    return (
        <ImageContainer>
            <LabelButtonRow>
                <LabelButton onPress={() => { setUploadType('mainImage'); setIsModalOpen(true); }}>Upload Main Image</LabelButton>
            </LabelButtonRow>
            <ImageList>
                {generalData!.defaultImages.map(url => (
                    <AspectImage
                        key={url}
                        alt={`House default image ${url}`}
                        src={url}
                        width={100}
                        onClick={() => handleMainImageUpload(url)} />
                ))}
            </ImageList>
            <MainImageContainer>
                {mainImageUrl && (
                    <AspectImage
                        src={mainImageUrl}
                        alt={'House main image'}
                        height={200}
                    />
                )}
            </MainImageContainer>

            <LabelButtonRow>
                <LabelButton onPress={() => { setUploadType('images'); setIsModalOpen(true); }}>Upload Images</LabelButton>
            </LabelButtonRow>
            <DndProvider backend={HTML5Backend}>
                <ImageList>
                    {formData.images.map((url, index) => (
                        <DraggableImage
                            key={index}
                            index={index}
                            url={url}
                            moveImage={moveImage}
                            deleteImage={deleteImage}
                            width={100} />
                    ))}
                </ImageList>
            </DndProvider>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {uploadType === 'mainImage' ? (
                    <UploadSingleImage onImageUpload={handleMainImageUpload} />
                ) : (
                    <UploadMultipleImages onImagesUpload={handleImagesUpload} />
                )}
            </Modal>
        </ImageContainer>
    );
};

export default HouseFormImages;