'use client';

import React, { useEffect, useState } from 'react';
import services from '@/di';
import { BackupIndex } from 'living-mile-high-lib';
import { PageContainer } from './StyledBackupComponents';
import BackupItem from './BackupItem';
import { LockProvider, useLock } from '@/contexts/LockContext';
import CreateBackupSection from './CreateBackupSection';

const BackupComponent = () => {
    const { apiService } = services();
    const [backups, setBackups] = useState<BackupIndex[]>([]);
    const [newBackupName, setNewBackupName] = useState('');
    const [editingBackupKey, setEditingBackupKey] = useState('');
    const [renameBackupName, setRenameBackupName] = useState('');

    const { isValid, expectChange, unexpectChange } = useLock();

    useEffect(() => {
        if (!isValid) {
            if (window.confirm("Site data update detected. Please reload the page.")) {
                window.location.reload();
            } else {
                window.location.reload();
            }
        }
    }, [isValid]);

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        const backupIndices = await apiService.getBackupIndices();
        setBackups(backupIndices);
    };

    const handleCreateBackup = async () => {
        const success = await apiService.createBackup(newBackupName);
        if (success) {
            alert('Backup created successfully');
            fetchBackups();
            setNewBackupName('');
        } else {
            alert('Failed to create backup');
        }
    };

    const handleRenameBackup = async () => {
        if (editingBackupKey && renameBackupName) {
            const success = await apiService.renameBackup(editingBackupKey, renameBackupName);
            if (success) {
                alert('Backup renamed successfully');
                fetchBackups();
                setEditingBackupKey('');
                setRenameBackupName('');
            } else {
                alert('Failed to rename backup');
            }
        }
    };

    const handleDeleteBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to delete this backup?');
        if (confirm) {
            const success = await apiService.deleteBackup(key);
            if (success) {
                alert('Backup deleted successfully');
                fetchBackups();
            } else {
                alert('Failed to delete backup');
            }
        }
    };

    const handleRestoreBackup = async (key: string) => {
        const confirm = window.confirm('Are you sure you want to restore this backup?');
        if (confirm) {
            expectChange();
            const success = await apiService.restoreBackup(key);
            if (success) {
                alert('Backup restored successfully');
                fetchBackups();
            } else {
                alert('Failed to restore backup');
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