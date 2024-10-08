'use client';

import AspectImage from "@/components/images/AspectImage";
import ImagePicker from "@/components/images/ImagePicker";
import ReorderableImageRow from "@/components/images/ReorderableImageRow";
import Modal from "@/components/layout/Modal";
import { useAlert } from "@/contexts/AlertContext";
import { useServices } from "@/contexts/ServiceContext";
import { useSiteData } from "@/contexts/SiteDataContext";
import { Alert, AlertTitle } from "@/types";
import { objectsEqual } from "@/utils/misc";
import { GeneralData } from "living-mile-high-lib";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Label, TextArea, View, YStack, styled } from "tamagui";

const FormContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
});

const ColumnsContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
})

const LeftColumn = styled(YStack, {
    flex: 1,
    width: 400,
    marginRight: 20,
    alignItems: 'center',
});

const RightColumn = styled(YStack, {
    width: 400,
    flex: 1,
    alignItems: 'center',
});

const LabelButton = styled(Button, {
    fontWeight: 'bold',
});

const LabelButtonRow = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
});

const SingleImageContainer = styled(YStack, {
    height: 200,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
});

const StyledTextArea = styled(TextArea, {
    width: '100%',
    minHeight: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 15,
});

const FormLabelContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

const FormLabelText = styled(Label, {
    marginBottom: 5,
    fontWeight: 'bold',
});

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <FormLabelContainer>
        <FormLabelText>{children}</FormLabelText>
    </FormLabelContainer>
)

enum UploadType {
    DEFAULT_IMAGES = 'defaultImages',
    HOME_PAGE_IMAGES = 'homePageImages',
    CONTACT_IMAGE = 'contactImage',
    ABOUT_IMAGE = 'aboutImage',
}

const validateForm = (formData: GeneralData): string[] => {
    const errors: string[] = [];

    if (formData.homePageImages.length === 0) {
        errors.push('At least one default image is required.');
    }

    ['contact', 'about'].forEach(key => {
        ['image', 'text'].forEach(subKey => {
            if (!(formData as any)[key][subKey]) {
                errors.push(`${key} ${subKey} is required.`);
            }
        })
    })

    return errors;
}

const GeneralDataForm: React.FC = () => {
    const { withAlertAsync, withAlertSync } = useAlert();
    const { generalData } = useSiteData();
    const { apiService } = useServices();
    const [formData, setFormData] = useState<GeneralData>(generalData!);
    const [uploadType, setUploadType] = useState<UploadType>(UploadType.DEFAULT_IMAGES);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        withAlertSync(() => {
            const newGeneralData = generalData!;

            const noUpdate = objectsEqual(newGeneralData, formData);

            setFormData(newGeneralData);

            return noUpdate ? null : new Alert(AlertTitle.WARNING, 'General data update detected. Refreshing form data...');
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generalData]);

    const setDefaultImages = useCallback((images: React.SetStateAction<string[]>) => {
        setFormData((prev) => ({
            ...prev,
            defaultImages: typeof images === 'function' ? images(prev.defaultImages) : images,
        }));
    }, []);

    const setHomePageImages = useCallback((images: React.SetStateAction<string[]>) => {
        setFormData((prev) => ({
            ...prev,
            homePageImages: typeof images === 'function' ? images(prev.homePageImages) : images,
        }));
    }, []);

    const handleDefaultImagesUpload = useCallback(async (urls: string[]) => {
        setDefaultImages((prev) => [...prev, ...urls]);
        setIsModalOpen(false);
    }, [setDefaultImages]);

    const handleHomePageImagesUpload = useCallback(async (urls: string[]) => {
        setHomePageImages((prev) => [...prev, ...urls]);
        setIsModalOpen(false);
    }, [setHomePageImages]);

    const handleAboutImageUpload = useCallback(async (url?: string) => {
        if (url) {
            setFormData((prev) => ({ ...prev, about: { ...prev.about, image: url } }));
        }
        setIsModalOpen(false);
    }, [setFormData]);

    const handleContactImageUpload = useCallback(async (url?: string) => {
        if (url) {
            setFormData((prev) => ({ ...prev, contact: { ...prev.contact, image: url } }));
        }
        setIsModalOpen(false);
    }, [setFormData]);

    const handleFormSubmit = useCallback(async () => {
        await withAlertAsync(async () => {
            const errors = validateForm(formData);

            if (errors.length > 0) {
                const errorString = errors.join('\n');
                return new Alert(AlertTitle.ERROR, errorString);
            }

            try {
                await apiService.updateGeneralData(formData);
                return new Alert(AlertTitle.SUCCESS, 'General data updated successfully.');
            } catch (error) {
                return new Alert(AlertTitle.ERROR, 'An error occurred while submitting the form. Please try again.');
            }
        })

    }, [apiService, formData, withAlertAsync]);

    const isMultipleUpload = useMemo(() => (uploadType === UploadType.DEFAULT_IMAGES || uploadType === UploadType.HOME_PAGE_IMAGES), [uploadType]);

    const handleUpload = useMemo(() => {
        switch (uploadType) {
            case UploadType.DEFAULT_IMAGES:
                return handleDefaultImagesUpload;
            case UploadType.HOME_PAGE_IMAGES:
                return handleHomePageImagesUpload;
            case UploadType.CONTACT_IMAGE:
                return handleContactImageUpload;
            case UploadType.ABOUT_IMAGE:
                return handleAboutImageUpload;
        }
    }, [uploadType, handleDefaultImagesUpload, handleHomePageImagesUpload, handleContactImageUpload, handleAboutImageUpload]);

    return (
        <FormContainer>
            <ColumnsContainer>
                <LeftColumn>
                    <FormLabel>About Text</FormLabel>
                    <StyledTextArea
                        placeholder="about text here..."
                        value={formData.about.text}
                        onChange={(e: any) => {
                            setFormData(prev => ({ ...prev, about: { ...prev.about, text: e.target.value } }));
                        }}
                    />
                    <LabelButtonRow>
                        <LabelButton
                            onPress={() => {
                                setUploadType(UploadType.ABOUT_IMAGE);
                                setIsModalOpen(true);
                            }}>Upload About Image</LabelButton>
                    </LabelButtonRow>
                    <SingleImageContainer>
                        <AspectImage
                            src={formData.about.image}
                            alt={'about image'}
                            height={200}
                        />
                    </SingleImageContainer>
                    <LabelButtonRow>
                        <LabelButton
                            onPress={() => {
                                setUploadType(UploadType.DEFAULT_IMAGES);
                                setIsModalOpen(true);
                            }}>Upload Default Main Images</LabelButton>
                    </LabelButtonRow>
                    <ReorderableImageRow
                        images={formData.defaultImages}
                        setImages={setDefaultImages}
                    />
                </LeftColumn>
                <RightColumn>
                    <FormLabel>Contact Text</FormLabel>
                    <StyledTextArea
                        placeholder="contact text here..."
                        value={formData.contact.text}
                        onChange={(e: any) => {
                            setFormData(prev => ({ ...prev, contact: { ...prev.contact, text: e.target.value } }));
                        }}
                    />
                    <LabelButtonRow>
                        <LabelButton
                            onPress={() => {
                                setUploadType(UploadType.CONTACT_IMAGE);
                                setIsModalOpen(true);
                            }}>Upload Contact Image</LabelButton>
                    </LabelButtonRow>
                    <SingleImageContainer>
                        <AspectImage
                            src={formData.contact.image}
                            alt={'contact image'}
                            height={200}
                        />
                    </SingleImageContainer>
                    <LabelButtonRow>
                        <LabelButton
                            onPress={() => {
                                setUploadType(UploadType.HOME_PAGE_IMAGES);
                                setIsModalOpen(true);
                            }}>Upload Home Page Images</LabelButton>
                    </LabelButtonRow>
                    <ReorderableImageRow
                        images={formData.homePageImages}
                        setImages={setHomePageImages}
                    />
                </RightColumn>
            </ColumnsContainer>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ImagePicker onUpload={handleUpload} multiple={isMultipleUpload} />
            </Modal>
            <Button onPress={handleFormSubmit}>Submit</Button>
        </FormContainer>
    );
};

const GeneralDataPage = () => {
    return (
        <GeneralDataForm />
    );
};

export default GeneralDataPage;