'use client';

import { useRouter } from 'next/navigation';
import { Button, XStack } from 'tamagui';

const AdminPanel = () => {
    const router = useRouter();

    const gotoBackups = () => {
        router.push('/admin/backups');
    }

    return (
        <XStack justifyContent="center" alignItems="center">
            <Button color="blue" onPress={gotoBackups}>
                Go to Backups
            </Button>
        </XStack>
    );
};

export default AdminPanel;