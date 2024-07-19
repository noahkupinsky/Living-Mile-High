import React from 'react';
import { BackupIndex, BackupType } from 'living-mile-high-lib';
import { Input, Text } from 'tamagui';
import { BackupListItem, TitleArea, ButtonArea, StyledButton } from './StyledBackupComponents';

type BackupItemProps = {
    backup: BackupIndex;
    isEditing: boolean;
    renameBackupName: string;
    titleWidth: string;
    buttonsWidth: string;
    onRenameChange: (text: string) => void;
    onRenameBlur: () => void;
    onStartEditing: () => void;
    onCancelEditing: () => void;
    onRestore: () => void;
    onDelete: () => void;
};

const BackupItem: React.FC<BackupItemProps> = ({
    backup,
    isEditing,
    renameBackupName,
    titleWidth,
    buttonsWidth,
    onRenameChange,
    onRenameBlur,
    onStartEditing,
    onCancelEditing,
    onRestore,
    onDelete,
}) => {
    return (
        <BackupListItem>
            <TitleArea width={titleWidth}>
                {isEditing ? (
                    <Input
                        value={renameBackupName}
                        onChangeText={onRenameChange}
                        onBlur={onRenameBlur}
                        autoFocus
                    />
                ) : (
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ flexGrow: 1, flexShrink: 1 }}>{backup.name}</Text>
                )}
            </TitleArea>
            <ButtonArea width={buttonsWidth}>
                {backup.backupType === BackupType.MANUAL && (
                    isEditing ? (
                        <StyledButton onPress={onCancelEditing}>Cancel</StyledButton>
                    ) : (
                        <StyledButton onPress={onStartEditing}>Rename</StyledButton>
                    )
                )}
                <StyledButton onPress={onRestore}>Restore</StyledButton>
                {backup.backupType === BackupType.MANUAL && (
                    <StyledButton color="red" onPress={onDelete}>Delete</StyledButton>
                )}
            </ButtonArea>
        </BackupListItem>
    );
};

export default BackupItem;