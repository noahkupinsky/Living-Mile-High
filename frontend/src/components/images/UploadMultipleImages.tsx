import { ImageFormat } from '@/types';
import React, { useState } from 'react';
import { View, Input, Button, styled } from 'tamagui';

const ImageUploadContainer = styled(View, {
    padding: 20,
    gap: 20
});

type UploadMultipleImagesProps = {
    onImagesUpload: (images: ImageFormat[]) => void;
};

const UploadMultipleImages: React.FC<UploadMultipleImagesProps> = ({ onImagesUpload }) => {
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [localFiles, setLocalFiles] = useState<File[]>([]);

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setImageURLs(value.split(',').map(url => url.trim()));
    };

    const handleAddImages = () => {
        onImagesUpload([...imageURLs, ...localFiles]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const filesArray = Array.from(files);
            setLocalFiles(prevFiles => [...prevFiles, ...filesArray]);
        }
    };

    return (
        <ImageUploadContainer>
            <Input
                type="text"
                placeholder="Paste image URLs, separated by commas"
                onChange={handleURLChange}
            />
            <input type="file" multiple onChange={handleFileChange} />
            <Button onPress={handleAddImages}>Add Images</Button>
        </ImageUploadContainer>
    );
};

export default UploadMultipleImages;