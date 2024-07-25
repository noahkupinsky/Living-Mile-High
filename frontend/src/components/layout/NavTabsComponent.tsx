import { filterNavTabs } from "@/config/navTabs";
import { useAuth } from "@/contexts/AuthContext";
import { NavTab } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { styled, Image, Text, View, XStack } from "tamagui";

const StyledTabContainer = styled(XStack, {
    cursor: 'pointer',
    padding: 10
});

const StyledTabText = styled(Text, {
    fontSize: '$2',
});

const NavTabsComponent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const handleMouseEnter = (tabName: string) => setHoveredTab(tabName);
    const handleMouseLeave = () => setHoveredTab(null);

    const renderTab = (tab: NavTab) => {
        const isActive = pathname.startsWith(tab.path);
        const onHome = pathname === '/';
        const isHovered = hoveredTab === tab.name;
        const isDark = isHovered || (!hoveredTab && (isActive || onHome));
        const nonAdminColor = isDark ? '$darkGray' : '$lightGray';
        const adminColor = isDark ? '#e00' : '#ff6961';
        const color = tab.isAdmin ? adminColor : nonAdminColor;

        return (
            <StyledTabContainer
                key={tab.name}
                onPress={() => router.push(tab.path)}
                onMouseEnter={() => handleMouseEnter(tab.name)}
                onMouseLeave={handleMouseLeave}
            >
                <StyledTabText color={color} style={{ transition: 'color 0.3s ease' }}>
                    {tab.name}
                </StyledTabText>
            </StyledTabContainer>
        );
    };

    return (
        <View
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
        >
            {filterNavTabs(isAuthenticated).map(renderTab)}
            <Image
                onPress={() => window.open('https://instagram.com')}
                cursor="pointer"
                src="/instagram-logo.png"
                alt="Instagram"
                width={24}
                height={24}
            />
        </View>
    );
};

export default NavTabsComponent;