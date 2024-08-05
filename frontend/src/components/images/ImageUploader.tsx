import React, { useState } from 'react';
import { FileUploaderInline, OutputCollectionState, OutputCollectionStatus, OutputFileEntry, OutputFileStatus } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { env } from 'next-runtime-env';
import { Text, View } from 'tamagui';
import { clearUploadcare, downloadImage, processImage } from '@/utils/imageProcessing';
import { ImageFormat } from '@/types';

const publicKey = () => env('NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY');

type SingleUpload = (url?: string) => void;

type MultipleUpload = (urls: string[]) => void;

type UploadcareFileUploaderProps = {
    onDone: SingleUpload | MultipleUpload;
    multiple: boolean;
};

const ImageUploader: React.FC<UploadcareFileUploaderProps> = ({ onDone, multiple }) => {
    const [files, setFiles] = useState<OutputFileEntry<OutputFileStatus>[]>([]);

    const handleChangeEvent = (e: OutputCollectionState<OutputCollectionStatus, "maybe-has-group">) => {
        const successFiles = e.allEntries.filter((file: any) => file.status === "success");

        setFiles([
            ...successFiles,
        ]);
    };

    const handleUploadComplete = async () => {
        const fileData = await Promise.all(files.map(file => file.file ? file.file : downloadImage(file.externalUrl!)));

        const processImageResults = await Promise.all(fileData.map(data => processImage(data)));
        const urls = processImageResults.filter(url => url !== undefined) as string[];

        multiple ? (onDone as MultipleUpload)(urls) : (onDone as SingleUpload)(urls[0]);

        await clearUploadcare();
    }

    return (
        <View style={{ width: '400px' }}>
            <FileUploaderInline
                pubkey={publicKey()}
                onChange={handleChangeEvent}
                onDoneClick={handleUploadComplete} />
        </View>
    )

};

export default ImageUploader;