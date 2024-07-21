'use client';

import React, { useEffect, useState } from 'react';
import services from '@/di';
import { BackupIndex } from 'living-mile-high-lib';
import { PageContainer } from './StyledBackupComponents';
import BackupItem from './BackupItem';
import { LockProvider, useLock } from '@/contexts/LockContext';
import CreateBackupSection from './CreateBackupSection';
import { useSiteData } from '@/contexts/SiteDataContext';

const BackupComponent = () => {
    const { apiService } = services();
    const { restoreBackup } = useSiteData();
    const [backups, setBackups] = useState<BackupIndex[]>([]);
    const [newBackupName, setNewBackupName] = useState('');
    const [editingBackupKey, setEditingBackupKey] = useState('');
    const [renameBackupName, setRenameBackupName] = useState('');

    const { isValid, expectChange, unexpectChange } = useLock();

    useEffect(() => {
        if (!isValid) {
            alert("Site data update detected. Please reload the page.");
            window.location.reload();
        }
    }, [isValid]);

    const fetchBackups = async () => {
        try {
            const backupIndices = await apiService.getBackupIndices();
            setBackups(backupIndices);
        } catch (e) {
            alert(`Failed to fetch backups. ${e}`);
        }
    };

    useEffect(() => {
        fetchBackups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleCreateBackup = async () => {
        try {
            await apiService.createBackup(newBackupName);
            alert('Backup created successfully');

            await fetchBackups();
            setNewBackupName('');
        } catch (e) {
            alert(`Failed to create backup. ${e}`);
        }
    };

    const handleRenameBackup = async () => {
        if (editingBackupKey && renameBackupName) {
            try {
                await apiService.renameBackup(editingBackupKey, renameBackupName);
                alert('Backup renamed successfully');

                await fetchBackups();

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
                await apiService.deleteBackup(key);
                alert('Backup deleted successfully');

                await fetchBackups();
            } catch (e) {
                alert(`Failed to delete backup. ${e}`);
            }
        }
    };

    const handleRestoreBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to restore this backup?');
        if (confirm) {
            expectChange();
            try {
                await apiService.restoreBackup(key);
                alert('Backup restored successfully');

                await fetchBackups();
            } catch (e) {
                alert(`Failed to delete backup. ${e}`);
                unexpectChange();
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
        </PageContainer>
    );
};

const BackupPage = () => {
    return (
        <LockProvider>
            <BackupComponent />
        </LockProvider>
    );
};

export default BackupPage;