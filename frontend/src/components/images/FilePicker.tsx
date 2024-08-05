import React, { useState, useEffect, ChangeEventHandler, useCallback } from 'react';
import { Input, Button, View, Text } from 'tamagui';
import { useGoogle } from '@/contexts/GoogleContext';
import { processImage } from '@/utils/imageProcessing';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { ImageFormat } from '@/types';


type SingleUpload = (url?: string) => void;

type MultipleUpload = (urls: string[]) => void;

type FilePickerProps = {
    multiple: boolean;
    onUpload: SingleUpload | MultipleUpload;
};

function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const FilePicker: React.FC<FilePickerProps> = ({ multiple, onUpload }) => {
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const { isLoaded, accessToken, login } = useGoogle();
    const [inputValue, setInputValue] = useState('');
    const [files, setFiles] = useState<ImageFormat[]>([]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles((prevFiles) => (multiple ? [...prevFiles, ...selectedFiles] : selectedFiles));
    };

    const handleUrlChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setInputValue(e.nativeEvent.text);
    };

    const handleAddUrls = () => {
        const urlList = multiple ? inputValue.split(',') : [inputValue];
        const trimmedUrls = urlList.map((url) => url.trim());
        setFiles((prevFiles) => (multiple ? [...prevFiles, ...trimmedUrls] : trimmedUrls));
        setInputValue('');
    };

    const handlePickerCallback = useCallback(async (data: google.picker.ResponseObject) => {
        if (data.action === google.picker.Action.PICKED) {
            const pickedFiles = data.docs.map(doc => doc.id);

            const filePromises = pickedFiles.map(async (fileId: string) => {
                // Get the file content using the file ID
                const fileMetadataResponse = await gapi.client.drive.files.get({
                    fileId: fileId,
                    fields: 'name, mimeType'
                });
                const fileMetadata = fileMetadataResponse.result;

                // Fetch the file content
                const fileContentResponse = await gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                });

                const byteString = fileContentResponse.body;

                const arrayBuffer = new ArrayBuffer(byteString.length);
                const uint8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < byteString.length; i++) {
                    uint8Array[i] = byteString.charCodeAt(i);
                }

                const blob = new Blob([uint8Array], { type: fileMetadata.mimeType });
                const file = new File([blob], fileMetadata.name!, { type: fileMetadata.mimeType });

                console.log(fileToDataURL(file));
                return file;
            });

            const newFiles = await Promise.all(filePromises);
            setFiles((prevFiles) => (multiple ? [...prevFiles, ...newFiles] : newFiles));
            setIsPickerVisible(false);
        }
    }, [multiple]);

    useEffect(() => {
        if (!isLoaded || !accessToken) return () => { };

        const picker = new google.picker.PickerBuilder()
            .addView(multiple ? google.picker.ViewId.DOCS : google.picker.ViewId.DOCS)
            .setOAuthToken(accessToken)
            .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!)
            .setCallback(handlePickerCallback)
            .setMaxItems(multiple ? 1000 : 1)
            .build();

        if (isPickerVisible) {
            picker.setVisible(true);
        }

        return () => picker.setVisible(false); // Cleanup on unmount
    }, [isLoaded, accessToken, isPickerVisible, multiple, handlePickerCallback]);

    const openGooglePicker = () => {
        if (!accessToken) {
            login();
            return;
        }
        setIsPickerVisible(true);
    };

    const handleSubmit = async () => {
        const proccessedUrls = await Promise.all(files.map((file) => processImage(file)));
        console.log(proccessedUrls);
        const validUrls = proccessedUrls.filter(url => url !== undefined) as string[];
        const uploadData = multiple ? validUrls : validUrls.shift();
        onUpload(uploadData as unknown as any);
    };

    const handleClearFiles = () => {
        setFiles([]);
    };

    return (
        <View gap={'10px'}>
            <View>
                <Input
                    value={inputValue}
                    onChange={handleUrlChange}
                    placeholder={multiple ? 'Enter URLs, separated by commas' : 'Enter URL'}
                />
                <Button onPress={handleAddUrls}>Add URL(s)</Button>
            </View>

            <View>
                <input
                    type="file"
                    multiple={multiple}
                    onChange={handleFileChange}
                />
            </View>

            <View>
                <Button onPress={openGooglePicker}>Pick from Google Drive</Button>
            </View>

            <View flexDirection='row' justifyContent='space-between' gap='5px'>
                <View height='100%' flexDirection='row' alignItems='center'>
                    <Text>{`${files.length} file(s) uploaded`}</Text>
                </View>
                <Button onPress={handleClearFiles}>Clear Files</Button>
                <Button onPress={handleSubmit}>Submit</Button>
            </View>
        </View>
    );
};

export default FilePicker;