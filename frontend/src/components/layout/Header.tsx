'use client';

import { Image, Text, styled, View, XStack, YStack } from 'tamagui';
import { useRouter } from 'next/navigation';
import NavTabsComponent from './NavTabsComponent';
import { useResize } from '@/contexts/ResizeContext';
import { useRef, useState, useEffect, useCallback } from 'react';
import HamburgerMenuComponent from './HamburgerMenuComponent';

const HeaderContainer = styled(View, {
    width: '100%',
    paddingTop: '2%',
    paddingBottom: '2%',
});

const WideHeaderContainer = styled(XStack, {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
})

const HamburgerHeaderContainer = styled(XStack, {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
});

const HeaderLeftContainer = styled(View, {
    paddingLeft: '4%',
})

const HeaderRightContainer = styled(View, {
    paddingRight: '2%',
})

// Inline SVG for Hamburger Icon
const HamburgerIconContainer = styled(View, {
    cursor: 'pointer',
    paddingHorizontal: '2%',
});

const HamburgerIcon = ({ ...props }: any) => (
    <HamburgerIconContainer {...props}>
        <svg viewBox="0 0 100 80" width="24" height="24">
            <rect width="100" height="10" rx="5" fill="#666" />
            <rect y="30" width="100" height="10" rx="5" fill="#666" />
            <rect y="60" width="100" height="10" rx="5" fill="#666" />
        </svg>
    </HamburgerIconContainer>
);

const Header = () => {
    const router = useRouter();
    const { width, addResizeListener, removeResizeListener } = useResize();
    const [isResolved, setIsResolved] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const [isHamburger, setIsHamburger] = useState(false);
    const [rightWidth, setRightWidth] = useState<number | null>(null);
    const [leftWidth, setLeftWidth] = useState<number | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const checkDimensions = useCallback(() => {
        if (!headerRef.current) {
            return;
        }

        const headerWidth = headerRef.current.offsetWidth;
        const currentLeftWidth = leftWidth !== null ? leftWidth : leftRef.current ? leftRef.current.scrollWidth : 0;
        const currentRightWidth = rightWidth !== null ? rightWidth : rightRef.current ? rightRef.current.scrollWidth : 0;

        if (currentLeftWidth + currentRightWidth > headerWidth) {
            if (!isHamburger) {
                setIsHamburger(true);
                setLeftWidth(leftRef.current ? leftRef.current.scrollWidth : null);
                setRightWidth(rightRef.current ? rightRef.current.scrollWidth : null);
            }
        } else {
            if (isHamburger) {
                setIsHamburger(false);
            }
        }
        setIsResolved(true); // Set resolved to true after dimensions are checked

    }, [isHamburger, leftWidth, rightWidth]);

    useEffect(() => {
        checkDimensions();
        addResizeListener(checkDimensions);
        return () => {
            removeResizeListener(checkDimensions);
        };
    }, [width, addResizeListener, removeResizeListener, checkDimensions]);

    return (
        <HeaderContainer
            opacity={isResolved ? 1 : 0}
            ref={headerRef}
            style={{
                transition: 'opacity 0.1s ease-in-out',
            }}
        >
            {isHamburger ? (
                <HamburgerHeaderContainer>
                    {/* invisible to balance out spacing */}
                    <HamburgerIcon style={{ visibility: "hidden" }} />
                    <Image
                        onPress={() => router.push('/')}
                        src="/company-logo.png"
                        alt="Company Logo"
                        cursor="pointer"
                        width={50}
                        height={50}
                    />
                    <>
                        <HamburgerIcon onPress={() => setMenuOpen(true)} />
                        <HamburgerMenuComponent isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                    </>
                </HamburgerHeaderContainer>
            ) : (
                <WideHeaderContainer>
                    <HeaderLeftContainer ref={leftRef}>
                        <Image
                            onPress={() => router.push('/')}
                            src="/company-logo.png"
                            alt="Company Logo"
                            cursor="pointer"
                            width={150}
                            height={150}
                        />
                    </HeaderLeftContainer>
                    <HeaderRightContainer ref={rightRef}>
                        <NavTabsComponent />
                    </HeaderRightContainer>
                </WideHeaderContainer>
            )}
        </HeaderContainer>
    );
};

export default Header;