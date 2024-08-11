import React, { useState } from 'react';
import { styled, XStack, YStack, View } from 'tamagui';
import { NavTabConfig } from '@/types';
import NavTabComponent from './NavTabComponent';
import Instagram from './Instagram';
import { tokens } from '@/config/tamagui.config';

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
    zIndex: 2000,
});

const InstagramContainer = styled(XStack, {
    cursor: 'pointer',
    justifyContent: 'flex-end',
    padding: 10,
});

type HamburgerMenuNavigationProps = {
    tabs: NavTabConfig[];
    isOpen: boolean;
    onClose: () => void;
    setHoveredTab: React.Dispatch<React.SetStateAction<string | null>>;
    hoveredTab: string | null;
};

const HamburgerMenuNavigation: React.FC<HamburgerMenuNavigationProps> = ({ tabs, isOpen, onClose, setHoveredTab, hoveredTab }) => {
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
                {tabs.map(tab =>
                (<NavTabComponent
                    key={tab.name}
                    tab={tab}
                    onPress={onClose}
                    setHoveredTab={setHoveredTab}
                    hoveredTab={hoveredTab}
                    paddingVertical={17}
                    justifyContent={'flex-end'}
                />)
                )}
                <InstagramContainer>
                    <Instagram size={30} />
                </InstagramContainer>
            </MenuContainer>
        </Overlay>
    );
};

// Inline SVG for Hamburger Icon
const HamburgerIconContainer = styled(View, {
    cursor: 'pointer',
});

type HamburgerMenuProps = {
    inactive?: boolean;
    size: number;
    setHoveredTab?: React.Dispatch<React.SetStateAction<string | null>>;
    hoveredTab?: string | null;
    tabs?: NavTabConfig[];
};


const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ tabs, size, inactive, hoveredTab, setHoveredTab }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    // @ts-ignore
    const color = tokens.color.darkGray.val;

    return (
        <>
            <HamburgerIconContainer
                onPress={() => !inactive && setMenuOpen!(true)}
                style={{
                    visibility: inactive ? 'hidden' : 'visible',
                }}
            >
                <svg viewBox="0 0 100 80" width={`${size}`} height={`${size}`}>
                    <rect width="100" height="10" rx="5" fill={color} />
                    <rect y="30" width="100" height="10" rx="5" fill={color} />
                    <rect y="60" width="100" height="10" rx="5" fill={color} />
                </svg>
            </ HamburgerIconContainer>
            {!inactive && (
                <HamburgerMenuNavigation
                    tabs={tabs!}
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen!(false)}
                    setHoveredTab={setHoveredTab!}
                    hoveredTab={hoveredTab!}
                />
            )}
        </>
    );
}

export default HamburgerMenu;