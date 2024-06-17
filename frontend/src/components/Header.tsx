import { Stack, Text, YStack } from 'tamagui';
import { useRouter } from 'next/router';

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
                //fontFamily="$heading"
                fontSize="$3"
                cursor="pointer"
                color="$text"
            >
                {/* Replace with your logo */}
                Company Logo
            </Text>
            <YStack flexDirection="row" gap="$3">
                {['About', 'Services', 'Contact'].map((tab) => (
                    <Text
                        key={tab}
                        onPress={() => router.push(`/${tab.toLowerCase()}`)}
                        // fontFamily="$body"
                        fontSize="$2"
                        color={router.pathname === `/${tab.toLowerCase()}` ? '$primary' : '$text'}
                        cursor="pointer"
                    >
                        {tab}
                    </Text>
                ))}
                <Text
                    onPress={() => window.open('https://instagram.com', '_blank')}
                    // fontFamily="$body"
                    fontSize="$2"
                    cursor="pointer"
                    color="$text"
                >
                    {/* Replace with Instagram logo */}
                    Instagram
                </Text>
            </YStack>
        </Stack>
    );
};

export default Header;