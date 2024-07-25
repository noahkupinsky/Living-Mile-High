import React, { useState } from 'react';
import { styled, XStack, YStack, Text, View } from 'tamagui';
import { useAuth } from '@/contexts/AuthContext';
import { filterNavTabs } from '@/config/navTabs';
import { useRouter, usePathname } from 'next/navigation';
import { NavTab } from '@/types';
import { Image } from 'tamagui';

const ANIMATION_LENGTH = '0.3s';

const Overlay = styled(View, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    zIndex: 1000,
});


const MenuContainer = styled(YStack, {
    backgroundColor: 'white',
    padding: 20,
    zIndex: 1001,
});

const StyledTabContainer = styled(XStack, {
    cursor: 'pointer',
    padding: 10,
});

const StyledTabText = styled(Text, {
    fontSize: '$2',
});

const HamburgerMenuComponent: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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
                onPress={() => {
                    router.push(tab.path);
                    onClose();
                }}
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
        <Overlay style={
            {
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'all' : 'none',
                position: 'fixed',
                transition: `opacity ${ANIMATION_LENGTH} ease-in-out`,
            }}
            onPress={onClose}
        >
            <MenuContainer
                style={{
                    transform: [{ translateX: isOpen ? 0 : 100 }],
                    transition: `transform ${ANIMATION_LENGTH} ease-in-out`
                }}
                onPress={(e: any) => e.stopPropagation()}
            >
                {filterNavTabs(isAuthenticated).map(renderTab)}
                <StyledTabContainer>
                    <Image
                        onPress={() => {
                            window.open('https://instagram.com')
                        }}
                        cursor="pointer"
                        src="/instagram-logo.png"
                        alt="Instagram"
                        width={24}
                        height={24}
                    />
                </StyledTabContainer>
            </MenuContainer>
        </Overlay>
    );
};

export default HamburgerMenuComponent;