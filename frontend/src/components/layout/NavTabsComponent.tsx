import { filterNavTabs } from "@/config/navTabs";
import { useAuth } from "@/contexts/AuthContext";
import { NavTab } from "@/types";
import { useRouter } from "next/navigation";
import { Text, YStack } from "tamagui";

type NavTabsComponentProps = {
    includeHome: boolean
}

const NavTabsComponent: React.FC<NavTabsComponentProps> = ({ includeHome }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

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
        <YStack
            flexDirection="row"
            gap="$3"
            alignItems="center"
            justifyContent="center"
        >
            {filterNavTabs(isAuthenticated, includeHome).map(renderTab)}
        </YStack>
    );
};

export default NavTabsComponent;