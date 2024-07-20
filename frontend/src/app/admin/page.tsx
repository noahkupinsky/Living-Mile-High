'use client';

import HouseList from '@/components/houses/HouseList';
import { useRouter } from 'next/navigation';
import { Button, YStack } from 'tamagui';

const AdminPanel = () => {
    const router = useRouter();

    const handleGotoBackups = () => {
        router.push('/admin/backups');
    }

    const handleCreateNew = () => {
        router.push('admin/upsert-house');
    };

    return (
        <YStack justifyContent="center" alignItems="center">
            <Button color="blue" onPress={handleGotoBackups}>
                Go to Backups
            </Button>
            <Button onPress={handleCreateNew}>
                Create New House
            </Button>
            <HouseList />
        </YStack>
    );
};

export default AdminPanel;