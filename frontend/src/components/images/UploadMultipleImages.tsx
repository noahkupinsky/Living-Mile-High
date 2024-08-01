import { processImage } from '@/utils/imageProcessing';
import React, { useState } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { View, Input, Button, styled } from 'tamagui';

const ImageUploadContainer = styled(View, {
    padding: 20,
    gap: 20
});

type UploadMultipleImagesProps = {
    onImagesUpload: (urls: string[]) => void;
};

const UploadMultipleImages: React.FC<UploadMultipleImagesProps> = ({ onImagesUpload }) => {
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [localFiles, setLocalFiles] = useState<File[]>([]);

    const handleURLChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const urls = e.nativeEvent.text;
        setImageURLs(urls.split(',').map(url => url.trim()));
    };

    const handleAddImages = async () => {
        const fileUrls = await Promise.all(localFiles.map(file => processImage(file)));
        const validFileUrls = fileUrls.filter(url => url !== undefined) as string[];
        onImagesUpload([...imageURLs, ...validFileUrls]);
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
                placeholder="Paste image URLs, separated by commas"
                onChange={handleURLChange}
            />
            <input type="file" multiple onChange={handleFileChange} />
            <Button onPress={handleAddImages}>Add Images</Button>
        </ImageUploadContainer>
    );
};

export default UploadMultipleImages;