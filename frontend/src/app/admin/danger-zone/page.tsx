'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BackupIndex, BackupType, EventMessage } from 'living-mile-high-lib';
import CreateBackupSection from './CreateBackupSection';
import { Alert, AlertTitle, SiteEventHandler } from '@/types';
import { useAlert } from '@/contexts/AlertContext';
import { useServices } from '@/contexts/ServiceContext';
import { Input, Text, ListItem, XStack, YStack, styled, Button } from 'tamagui';

const BackupListItem = styled(ListItem, {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
});

const TitleArea = styled(XStack, {
    flex: 1,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    flexGrow: 1,
    flexShrink: 1,
    width: '70%'
});

const ButtonArea = styled(YStack, {
    justifyContent: 'flex-end',
    gap: 5, // Adjusted for smaller padding between buttons
    width: '26%',
});

const StyledButton = styled(Button, {
    borderRadius: 8,
    padding: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    size: 20
});

const PageContainer = styled(YStack, {
    justifyContent: 'center',
    space: 'lg',
});

const DangerButton = styled(Button, {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
    cursor: 'pointer',
    hoverStyle: {
        backgroundColor: 'darkred',
    },
    pressStyle: {
        backgroundColor: 'maroon',
    },
});

function validateBackupName(name: string) {
    const allowedChars = /^[a-zA-Z0-9_ -]+$/;

    console.log(name);

    if (!allowedChars.test(name)) {
        throw new Error('Backup names may only contain letters, numbers, spaces, hyphens, and underscores');
    }
}

const DangerZonePage = () => {
    const { withAlertAsync } = useAlert();
    const { apiService, eventService } = useServices();
    const [backups, setBackups] = useState<BackupIndex[]>([]);
    const [newBackupName, setNewBackupName] = useState('');
    const [editingBackupKey, setEditingBackupKey] = useState('');
    const [renameBackupName, setRenameBackupName] = useState('');

    const fetchBackups = useCallback(async () => {
        await withAlertAsync(async () => {
            try {
                const backupIndices = await apiService.getBackupIndices();
                setBackups(backupIndices);
                return null;
            } catch (e) {
                return new Alert(AlertTitle.WARNING, `Failed to fetch backups. ${e}`);
            }
        }, { noLoading: true });
    }, [apiService, withAlertAsync]);

    useEffect(() => {
        const handler: SiteEventHandler = async (event, isLocal) => {
            if (event.messages.includes(EventMessage.BACKUPS_UPDATED)) {
                if (!isLocal) {
                    alert("Another admin just completed an action that affected the site's backups. " +
                        "It is strongly advised that you avoid doing any Danger Zone operations " +
                        "while another admin is working, to avoid overwriting their work. " +
                        "The updated backups will now be fetched."
                    );
                }
                await fetchBackups();
            }
        };

        eventService.addEventHandler(handler);

        return () => {
            eventService.removeEventHandler(handler);
        };
    }, [eventService, fetchBackups]);



    useEffect(() => {
        fetchBackups();
    }, [fetchBackups]);


    const handleCreateBackup = async () => {
        await withAlertAsync(async () => {
            try {
                validateBackupName(newBackupName);

                await apiService.createBackup(newBackupName);

                setNewBackupName('');

                return new Alert(AlertTitle.SUCCESS, 'Backup created successfully');
            } catch (e) {
                return new Alert(AlertTitle.ERROR, `Failed to create backup. ${e}`);
            }
        })
    };

    const handleRenameBackup = async () => {
        if (editingBackupKey && renameBackupName) {
            await withAlertAsync(async () => {
                try {
                    validateBackupName(renameBackupName);

                    await apiService.renameBackup(editingBackupKey, renameBackupName);

                    setEditingBackupKey('');
                    setRenameBackupName('');

                    return new Alert(AlertTitle.SUCCESS, 'Backup renamed successfully');
                } catch (e) {
                    return new Alert(AlertTitle.ERROR, `Failed to rename backup. ${e}`);
                }
            });
        }
    };

    const handleDeleteBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to delete this backup?');
        if (confirm) {
            await withAlertAsync(async () => {
                try {
                    await apiService.deleteBackup(key);

                    return new Alert(AlertTitle.SUCCESS, 'Backup deleted successfully');
                } catch (e) {
                    return new Alert(AlertTitle.ERROR, `Failed to delete backup. ${e}`);
                }
            });
        }
    };

    const handleRestoreBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to restore this backup?');
        if (confirm) {
            await withAlertAsync(async () => {
                try {
                    await apiService.restoreBackup(key);

                    return new Alert(AlertTitle.SUCCESS, 'Backup restored successfully');
                } catch (e) {
                    return new Alert(AlertTitle.ERROR, `Failed to restore backup. ${e}`);
                }
            });
        }
    };

    const handlePruneSiteData = async () => {
        const confirm = window.confirm(
            'Caution! This will remove all expired automatic backups, ' +
            'and considerably consolidate the remaining automatic backups. ' +
            'It will then permanently delete all assets (images) that are no ' +
            'longer used by either the site or a backup of the site. ' +
            'This operation is safe, with regard to the current data on the website. ' +
            'It will leave manual backups and currently used assets completely untouched. ' +
            'Are you sure that you want to proceed ? ');
        if (confirm) {
            await withAlertAsync(async () => {
                try {
                    await apiService.pruneSiteData();
                    return new Alert(AlertTitle.SUCCESS, 'Site data pruned successfully');
                } catch (e) {
                    return new Alert(AlertTitle.ERROR, `Failed to prune site data. ${e}`);
                }
            });
        }
    };

    const renderBackup = (backup: BackupIndex) => {
        const isEditing = editingBackupKey === backup.key;

        return (
            <BackupListItem key={backup.key}>
                <TitleArea>
                    {isEditing ? (
                        <Input
                            value={renameBackupName}
                            onChangeText={setRenameBackupName}
                            onBlur={handleRenameBackup}
                            autoFocus
                        />
                    ) : (
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ flexGrow: 1, flexShrink: 1 }}>{backup.name}</Text>
                    )}
                </TitleArea>
                <ButtonArea>
                    {backup.backupType === BackupType.MANUAL && (
                        isEditing ? (
                            <StyledButton onPress={() => {
                                setEditingBackupKey('');
                                setRenameBackupName('');
                            }}>Cancel</StyledButton>
                        ) : (
                            <StyledButton onPress={() => {
                                setEditingBackupKey(backup.key);
                                setRenameBackupName(backup.name);
                            }}>Rename</StyledButton>
                        )
                    )}
                    <StyledButton onPress={() => handleRestoreBackup(backup.key)}>Restore</StyledButton>
                    {backup.backupType === BackupType.MANUAL && (
                        <StyledButton color="red" onPress={() => handleDeleteBackup(backup.key)}>Delete</StyledButton>
                    )}
                </ButtonArea>
            </BackupListItem>
        )
    }

    return (
        <PageContainer>
            <CreateBackupSection
                newBackupName={newBackupName}
                setNewBackupName={setNewBackupName}
                handleCreateBackup={handleCreateBackup}
            />

            {backups.map((backup) => renderBackup(backup))}

            <DangerButton onPress={handlePruneSiteData}>
                Prune Site Data
            </DangerButton>
        </PageContainer>
    );
};

export default DangerZonePage;