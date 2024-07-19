import React from 'react';
import { SectionContainer, SectionTitle, StyledInput, CreateButton } from './StyledBackupComponents';
import { XStack } from 'tamagui';

type CreateBackupSectionProps = {
    newBackupName: string;
    setNewBackupName: (name: string) => void;
    handleCreateBackup: () => void;
};

const CreateBackupSection: React.FC<CreateBackupSectionProps> = ({ newBackupName, setNewBackupName, handleCreateBackup }) => {
    return (
        <SectionContainer>
            <SectionTitle>Create Manual Backup</SectionTitle>
            <XStack>
                <StyledInput
                    placeholder="Enter backup name"
                    value={newBackupName}
                    onChangeText={setNewBackupName}
                />
                <CreateButton onPress={handleCreateBackup}>Create Backup</CreateButton>
            </XStack>
        </SectionContainer>
    );
};

export default CreateBackupSection;