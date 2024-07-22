import React, { useState } from 'react';
import { Button, View, XStack, styled } from 'tamagui';
import { useSiteData } from '@/contexts/SiteDataContext';
import Modal from '@/components/layout/Modal';
import UploadSingleImage from '@/components/images/UploadSingleImage';
import UploadMultipleImages from '@/components/images/UploadMultipleImages';
import AspectImage from '@/components/images/AspectImage';
import ReorderableImageRow from '@/components/images/ReorderableImageRow';
import { imageFormatToUrl } from '@/utils/misc';
import { House } from 'living-mile-high-lib';

const ImageContainer = styled(View, {
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

const DefaultImagesContainer = styled(XStack, {
    width: '100%',
    marginBottom: 10,
})

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
};

const HouseFormImages: React.FC<HouseFormImagesProps> = ({
    formData,
    setFormData,
}) => {
    const { generalData } = useSiteData();
    const [uploadType, setUploadType] = useState<'mainImage' | 'images'>('mainImage');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const setImages = (images: React.SetStateAction<string[]>) => {
        setFormData(prev => {
            const newImages = typeof images === 'function' ? images(prev.images) : images;
            return { ...prev, images: newImages };
        });
    };

    const mainImageUrl = formData.mainImage === '' ? undefined : imageFormatToUrl(formData.mainImage);

    return (
        <ImageContainer>
            <LabelButtonRow>
                <LabelButton onPress={() => { setUploadType('mainImage'); setIsModalOpen(true); }}>Upload Main Image</LabelButton>
            </LabelButtonRow>
            <DefaultImagesContainer>
                {generalData!.defaultImages.map(url => (
                    <AspectImage
                        key={url}
                        alt={`House default image ${url}`}
                        src={url}
                        width={100}
                        onClick={() => handleMainImageUpload(url)} />
                ))}
            </DefaultImagesContainer>
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
            <ReorderableImageRow
                images={formData.images}
                setImages={setImages}
            />

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