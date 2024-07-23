'use client';

import { Image, Stack, Text, YStack } from 'tamagui';
import { useRouter } from 'next/navigation';
import NavTabsComponent from './NavTabsComponent';

const Header = () => {
    const router = useRouter();

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
                />
            </Text>
            <YStack flexDirection="row" gap="$3">
                <NavTabsComponent />
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