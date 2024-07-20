import React, { useState } from 'react';
import { Button, View, Label, styled } from 'tamagui';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useSiteData } from '@/contexts/SiteDataContext';
import { FormDataHouse } from '@/types';
import DraggableImage from '@/components/images/DraggableImage';
import Modal from '@/components/layout/Modal';
import UploadSingleImage from '@/components/images/UploadSingleImage';
import UploadMultipleImages from '@/components/images/UploadMultipleImages';
import AspectImage from '@/components/images/AspectImage';

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
    formData: FormDataHouse;
    setFormData: React.Dispatch<React.SetStateAction<FormDataHouse>>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HouseFormImages: React.FC<HouseFormImagesProps> = ({
    formData,
    setFormData,
    isModalOpen,
    setIsModalOpen
}) => {
    const { generalData } = useSiteData();
    const [uploadType, setUploadType] = useState<'mainImage' | 'images'>('mainImage');

    const deleteImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleMainImageUpload = (image: string | ArrayBuffer) => {
        setFormData(prev => ({ ...prev, mainImage: image }));
        setIsModalOpen(false);
    };

    const handleImagesUpload = (images: (string | ArrayBuffer)[]) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...images] }));
        setIsModalOpen(false);
    };

    const moveImage = (dragIndex: number, hoverIndex: number) => {
        const updatedImages = [...formData.images];
        const [draggedImage] = updatedImages.splice(dragIndex, 1);
        updatedImages.splice(hoverIndex, 0, draggedImage);
        setFormData({ ...formData, images: updatedImages });
    };

    const mainImageUrl = formData.mainImage && typeof formData.mainImage === 'string' ? formData.mainImage : URL.createObjectURL(new Blob([formData.mainImage]));

    return (
        <ImageContainer>
            <LabelButtonRow>
                <LabelButton onPress={() => { setUploadType('mainImage'); setIsModalOpen(true); }}>Upload Main Image</LabelButton>
            </LabelButtonRow>
            <ImageList>
                {generalData!.defaultImages.map(url => (
                    <AspectImage key={url} src={url} width={100} onClick={() => handleMainImageUpload(url)} />
                ))}
            </ImageList>
            <MainImageContainer>
                {mainImageUrl !== '' && (
                    <AspectImage
                        src={mainImageUrl}
                        height={200}
                    />
                )}
            </MainImageContainer>

            <LabelButtonRow>
                <LabelButton onPress={() => { setUploadType('images'); setIsModalOpen(true); }}>Upload Images</LabelButton>
            </LabelButtonRow>
            <DndProvider backend={HTML5Backend}>
                <ImageList>
                    {formData.images.map((img, index) => (
                        <DraggableImage
                            key={index}
                            index={index}
                            img={img}
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