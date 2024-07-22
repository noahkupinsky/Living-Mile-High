import AspectImage from "@/components/images/AspectImage";
import ReorderableImageRow from "@/components/images/ReorderableImageRow";
import UploadMultipleImages from "@/components/images/UploadMultipleImages";
import UploadSingleImage from "@/components/images/UploadSingleImage";
import Modal from "@/components/layout/Modal";
import { useSiteData } from "@/contexts/SiteDataContext";
import services from "@/di";
import { objectsEqual } from "@/utils/misc";
import { GeneralData } from "living-mile-high-lib";
import { useEffect, useState } from "react";
import { Button, Label, TextArea, View, styled } from "tamagui";

const FormContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    backgroundColor: 'white',
});

const ColumnsContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
})

const LeftColumn = styled(View, {
    flex: 1,
    width: 400,
    marginRight: 20,
});

const RightColumn = styled(View, {
    width: 400,
    flex: 1,
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

const SingleImageContainer = styled(View, {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
    resize: 'none', // This ensures the text area only expands downward
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

const GeneralDataForm: React.FC = () => {
    const { generalData } = useSiteData();
    const { apiService } = services();
    const [formData, setFormData] = useState<GeneralData>(generalData!);
    const [uploadType, setUploadType] = useState<UploadType>(UploadType.DEFAULT_IMAGES);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const newGeneralData = generalData!;
        if (!objectsEqual(newGeneralData, formData)) {
            alert('General data update detected. Repopulating form...');
        }
        setFormData(newGeneralData);
    }, [generalData]);

    const setDefaultImages = (images: React.SetStateAction<string[]>) => {
        setFormData(prev => {
            const newImages = typeof images === 'function' ? images(prev.defaultImages) : images;
            return { ...prev, defaultImages: newImages };
        });
    };

    const setHomePageImages = (images: React.SetStateAction<string[]>) => {
        setFormData(prev => {
            const newImages = typeof images === 'function' ? images(prev.homePageImages) : images;
            return { ...prev, homePageImages: newImages };
        });
    };

    const handleDefaultImagesUpload = async (urls: string[]) => {
        setDefaultImages(prev => [...prev, ...urls]);
        setIsModalOpen(false);
    };

    const handleHomePageImagesUpload = async (urls: string[]) => {
        setHomePageImages(prev => [...prev, ...urls]);
        setIsModalOpen(false);
    };

    const handleAboutImageUpload = async (url?: string) => {
        if (url) {
            setFormData(prev => ({ ...prev, about: { ...prev.about, image: url } }));
        }
        setIsModalOpen(false);
    };

    const handleContactImageUpload = async (url?: string) => {
        if (url) {
            setFormData(prev => ({ ...prev, contact: { ...prev.contact, image: url } }));
        }
        setIsModalOpen(false);
    };

    const handleFormSubmit = async () => {
        try {
            await apiService.updateGeneralData(formData);
            alert('General Data updated successfully!');
        } catch (error) {
            alert('An error occurred while submitting the form. Please try again.');
        }
    };

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
                {uploadType === UploadType.ABOUT_IMAGE || uploadType === UploadType.CONTACT_IMAGE ? (
                    <UploadSingleImage onImageUpload={
                        uploadType === UploadType.ABOUT_IMAGE ? handleAboutImageUpload : handleContactImageUpload
                    } />
                ) : (
                    <UploadMultipleImages onImagesUpload={
                        uploadType === UploadType.DEFAULT_IMAGES ? handleDefaultImagesUpload : handleHomePageImagesUpload
                    } />
                )}
            </Modal>
            <Button onPress={handleFormSubmit}>Submit</Button>
        </FormContainer>
    );
};

export default GeneralDataForm;