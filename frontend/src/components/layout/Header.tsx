'use client';

import { Stack, Text, YStack } from 'tamagui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { NavTab } from '@/types';
import { filterNavTabs } from '@/config/navTabs';

const Header = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const renderTab = (tab: NavTab) => (
        <Text
            key={tab.name}
            onPress={() => router.push(tab.path)}
            fontSize="$2"
            color={tab.isAdmin ? 'red' : '$text'}
            cursor="pointer"
        >
            {tab.name}
        </Text>
    );

    return (
        <Stack
            backgroundColor="$background"
            paddingVertical="$2"
            paddingHorizontal="$3"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
        >
            <Text
                onPress={() => router.push('/')}
                fontSize="$3"
                cursor="pointer"
                color="$text"
            >
                <Image
                    src="/company-logo.png"
                    alt="Company Logo"
                    width={150}
                    height={150}
                    priority
                />
            </Text>
            <YStack flexDirection="row" gap="$3">
                {filterNavTabs(isAuthenticated).map(renderTab)}
                <Text
                    onPress={() => window.open('https://instagram.com', '_blank')}
                    fontSize="$2"
                    cursor="pointer"
                    color="$text"
                >
                    <Image
                        src="/instagram-logo.png"
                        alt="Instagram"
                        width={24}
                        height={24}
                    />
                </Text>
            </YStack>
        </Stack>
    );
};

export default Header;