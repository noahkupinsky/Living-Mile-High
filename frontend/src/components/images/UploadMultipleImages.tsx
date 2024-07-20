import React, { useState } from 'react';
import { View, Input, Button, styled } from 'tamagui';

const ImageUploadContainer = styled(View, {
    padding: 20,
    gap: 20
});

type UploadMultipleImagesProps = {
    onImagesUpload: (images: (string | ArrayBuffer)[]) => void;
};

const UploadMultipleImages: React.FC<UploadMultipleImagesProps> = ({ onImagesUpload }) => {
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [localFiles, setLocalFiles] = useState<ArrayBuffer[]>([]);

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setImageURLs(value.split(',').map(url => url.trim()));
    };

    const handleAddURLs = () => {
        onImagesUpload([...imageURLs, ...localFiles]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const filesArray = Array.from(files);
            const fileReaders = filesArray.map(file => {
                return new Promise<ArrayBuffer>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.result) {
                            resolve(reader.result as ArrayBuffer);
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(file);
                });
            });

            Promise.all(fileReaders)
                .then(results => setLocalFiles(prevFiles => [...prevFiles, ...results]))
                .catch(error => console.error('File reading failed:', error));
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
            <Button onPress={handleAddURLs}>Add Images</Button>
        </ImageUploadContainer>
    );
};

export default UploadMultipleImages;