import React, { useState } from 'react';
import { View, Button, Input, Text, styled } from 'tamagui';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { processImage } from '@/utils/imageProcessing';

const ImageUploadContainer = styled(View, {
    padding: 20,
    gap: 20
});

type ImageUploadProps = {
    onImageUpload: (url?: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [imageURL, setImageURL] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleURLChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setImageURL(e.nativeEvent.text);
    };

    const handleAddURL = () => {
        if (imageURL) {
            onImageUpload(imageURL);
            setImageURL('');
            setError(null);
        } else {
            setError('Please enter a valid URL');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileUrl = await processImage(file);
            onImageUpload(fileUrl);
            setError(null);
        } else {
            setError('Please select a valid file');
        }
    };

    return (
        <ImageUploadContainer>
            <Input value={imageURL} onChange={handleURLChange} placeholder="Paste image URL" />
            <Button onPress={handleAddURL}>Add Image by URL</Button>
            <input type="file" onChange={handleFileChange} />
            {error && <Text>{error}</Text>}
        </ImageUploadContainer>
    );
};

export default ImageUpload;