'use client';

import { Stack, Text, YStack } from 'tamagui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const nonAdminPageNames = ['About', 'Contact'];
const adminPageNames = ['Admin'];

type NavTab = {
    name: string;
    path: string;
    color: string;
}

const nonAdminTabData = (name: string): NavTab => {
    return {
        name,
        path: `/${name.toLowerCase()}`,
        color: '$primary',
    };
}

const adminTabData = (name: string): NavTab => {
    return {
        name,
        path: `/${name.toLowerCase()}`,
        color: 'red',
    };
}

const nonAdminTabs: NavTab[] = nonAdminPageNames.map(n => nonAdminTabData(n));
const adminTabs: NavTab[] = adminPageNames.map(n => adminTabData(n));

const Header = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const renderTab = (tab: NavTab) => (
        <Text
            key={tab.name}
            onPress={() => router.push(tab.path)}
            fontSize="$2"
            color={tab.color}
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
                    width={50}
                    height={50}
                />
            </Text>
            <YStack flexDirection="row" gap="$3">
                {nonAdminTabs.concat(isAuthenticated ? adminTabs : []).map(renderTab)}
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