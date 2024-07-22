import React from 'react';
import { Button, Text, Input, Stack, styled, XStack } from 'tamagui';

export const SectionContainer = styled(Stack, {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
});

export const SectionTitle = styled(Text, {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
});

export const StyledInput = styled(Input, {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
});

export const CreateButton = styled(Button, {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#007bff',
});

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