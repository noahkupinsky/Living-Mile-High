'use client';

import React, { useCallback, useEffect, useState } from 'react';
import services from '@/di';
import { BackupIndex } from 'living-mile-high-lib';
import BackupItem from './BackupItem';
import CreateBackupSection from './CreateBackupSection';
import { useSiteData } from '@/contexts/SiteDataContext';
import { SiteUpdateHandler } from '@/types';

import { Button, YStack, styled } from 'tamagui';

export const PageContainer = styled(YStack, {
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
    textalign: 'center',
    cursor: 'pointer',
    hoverStyle: {
        backgroundColor: 'darkred',
    },
    pressStyle: {
        backgroundColor: 'maroon',
    },
});

const DangerZonePage = () => {
    const { apiService, updateService } = services();
    const [backups, setBackups] = useState<BackupIndex[]>([]);
    const [newBackupName, setNewBackupName] = useState('');
    const [editingBackupKey, setEditingBackupKey] = useState('');
    const [renameBackupName, setRenameBackupName] = useState('');

    const fetchBackups = useCallback(async () => {
        try {
            const backupIndices = await apiService.getBackupIndices();
            setBackups(backupIndices);
        } catch (e) {
            alert(`Failed to fetch backups. ${e}`);
        }
    }, [apiService]);

    useEffect(() => {
        const handleUpdate: SiteUpdateHandler = async (isLocal) => {
            if (!isLocal) {
                alert("Someone else just edited the website. Please be patient while we fetch the latest backups.");
                await fetchBackups();
            }
        };

        updateService.addUpdateHandler(handleUpdate);

        return () => {
            updateService.removeUpdateHandler(handleUpdate);
        };
    }, [updateService, fetchBackups]);



    useEffect(() => {
        fetchBackups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleCreateBackup = async () => {
        try {
            const newIndices = await apiService.createBackup(newBackupName);
            setBackups(newIndices);
            alert('Backup created successfully');

            setNewBackupName('');
        } catch (e) {
            alert(`Failed to create backup. ${e}`);
        }
    };

    const handleRenameBackup = async () => {
        if (editingBackupKey && renameBackupName) {
            try {
                const newIndices = await apiService.renameBackup(editingBackupKey, renameBackupName);
                setBackups(newIndices);
                alert('Backup renamed successfully');

                setEditingBackupKey('');
                setRenameBackupName('');
            } catch (e) {
                alert(`Failed to rename backup. ${e}`);
            }
        }
    };

    const handleDeleteBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to delete this backup?');
        if (confirm) {
            try {
                const newIndices = await apiService.deleteBackup(key);
                setBackups(newIndices);
                alert('Backup deleted successfully');
            } catch (e) {
                alert(`Failed to delete backup. ${e}`);
            }
        }
    };

    const handleRestoreBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to restore this backup?');
        if (confirm) {
            try {
                const newIndices = await apiService.restoreBackup(key);
                setBackups(newIndices);
                alert('Backup restored successfully');
            } catch (e) {
                alert(`Failed to restore backup. ${e}`);
            }
        }
    };

    const handlePruneSiteData = async () => {
        const confirm = window.confirm(
            'Caution! This will remove all expired automatic backups, ' +
            'and considerably consolidate the remaining automatic backups. ' +
            'It will then permanently delete all assets (images) that are no ' +
            'longer used by neither the site nor a backup of the site. ' +
            'This operation is safe, with regard to the current data on the website. ' +
            'It will leave manual backups and currently used assets completely untouched. ' +
            'Are you sure that you want to proceed ? ');
        if (confirm) {
            try {
                const newIndices = await apiService.pruneSiteData();
                setBackups(newIndices);
                alert('Site data pruned successfully');
            } catch (e) {
                alert(`Failed to prune site data. ${e}`);
            }
        }
    };

    return (
        <PageContainer>
            <CreateBackupSection
                newBackupName={newBackupName}
                setNewBackupName={setNewBackupName}
                handleCreateBackup={handleCreateBackup}
            />

            {backups.map((backup) => (
                <BackupItem
                    key={backup.key}
                    backup={backup}
                    isEditing={editingBackupKey === backup.key}
                    renameBackupName={renameBackupName}
                    titleWidth="70%"
                    buttonsWidth="26%"
                    onRenameChange={setRenameBackupName}
                    onRenameBlur={handleRenameBackup}
                    onStartEditing={() => {
                        setEditingBackupKey(backup.key);
                        setRenameBackupName(backup.name);
                    }}
                    onCancelEditing={() => {
                        setEditingBackupKey('');
                        setRenameBackupName('');
                    }}
                    onRestore={() => handleRestoreBackup(backup.key)}
                    onDelete={() => handleDeleteBackup(backup.key)}
                />
            ))}

            <DangerButton onPress={handlePruneSiteData}>
                Prune Site Data
            </DangerButton>
        </PageContainer>
    );
};

export default DangerZonePage;