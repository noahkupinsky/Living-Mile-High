'use client';

import { Text, styled, View, XStack, Image, YStack } from 'tamagui';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import HamburgerMenu from './HamburgerMenu';
import HorizontalLine from '../HorizontalLine';
import { filterNavTabs } from '@/config/navTabs';
import { useAuth } from '@/contexts/AuthContext';
import NavTabComponent from './NavTabComponent';
import Instagram from './Instagram';

const LARGE_LOGO_SIZE = 125;
const SMALL_LOGO_SIZE = 75;

const HeaderContainer = styled(YStack, {
    width: '100%',
    paddingTop: '2vh',
});

const NavContainer = styled(XStack, {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const HeaderLeftContainer = styled(XStack, {
    paddingLeft: '5rem',
    justifyContent: 'flex-start',
    alignItems: 'center',
})

const HeaderRightContainer = styled(XStack, {
    paddingRight: '5rem',
    justifyContent: 'flex-end',
    alignItems: 'center',
})

const HeaderText = styled(Text, {
    fontFamily: '$caps',
    fontSize: '$5',
    letterSpacing: '$5',
    color: '$darkGray',
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    textAlign: 'center',
    transform: 'translateY(-30%)',
    pointerEvents: 'none',
})

const SquareLogo: React.FC<any> = ({ size, ...props }) => {
    const router = useRouter();

    return (
        <View
            cursor="pointer"
            onPress={() => router.push('/')}
        >
            <Image
                source={{
                    uri: "/company-logo.png",
                    width: size,
                    height: size
                }}
                alt="Company Logo"
                {...props}
            />
        </View>
    );

}

const Header = () => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [isResolved, setIsResolved] = useState(false);
    const [isHamburger, setIsHamburger] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [rightWidth, setRightWidth] = useState<number | null>(null);
    const [leftWidth, setLeftWidth] = useState<number | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const tabs = useMemo(() => filterNavTabs(isAuthenticated), [isAuthenticated]);

    const handleResize = useCallback(() => {
        if (!headerRef.current) {
            return;
        }

        const headerWidth = headerRef.current.offsetWidth;
        const currentLeftWidth = leftRef.current ? leftRef.current.scrollWidth : leftWidth !== null ? leftWidth : 0;
        const currentRightWidth = rightRef.current ? rightRef.current.scrollWidth : rightWidth !== null ? rightWidth : 0;
        console.log(currentLeftWidth, currentRightWidth, headerWidth);

        if (currentLeftWidth + currentRightWidth > headerWidth) {
            if (!isHamburger) {
                setIsHamburger(true);
                setLeftWidth(currentLeftWidth);
                setRightWidth(currentRightWidth);
            }
        } else {
            if (isHamburger) {
                setIsHamburger(false);
            }
        }
        setIsResolved(true); // Set resolved to true after dimensions are checked

    }, [isHamburger, leftWidth, rightWidth]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleResize);

        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                resizeObserver.unobserve(headerRef.current);
            }
        };
    }, [handleResize]);


    useEffect(() => {
        handleResize();
    }, []);


    const headerName = pathname === '/' ? 'HOME' : tabs.find(tab => pathname.startsWith(tab.path))?.name.toLocaleUpperCase() || '';

    return (
        <HeaderContainer
            opacity={isResolved ? 1 : 0}
            ref={headerRef}
            style={{
                transition: 'opacity 0.1s ease-in-out',
            }}
        >

            {isHamburger ? (
                <NavContainer
                    key={"hamburger"}
                    height={SMALL_LOGO_SIZE}
                >
                    <HeaderLeftContainer>
                        <SquareLogo size={SMALL_LOGO_SIZE} />
                    </HeaderLeftContainer>
                    <HeaderText>{headerName}</HeaderText>
                    <HeaderRightContainer>
                        <HamburgerMenu
                            setHoveredTab={setHoveredTab}
                            hoveredTab={hoveredTab}
                            tabs={tabs}
                        />
                    </HeaderRightContainer>
                </NavContainer>
            ) : (
                <NavContainer
                    key={"wide"}
                    height={LARGE_LOGO_SIZE} >
                    <HeaderLeftContainer ref={leftRef}>
                        <SquareLogo
                            size={LARGE_LOGO_SIZE} />
                    </HeaderLeftContainer>
                    <HeaderRightContainer ref={rightRef}>
                        {tabs.map(tab => <NavTabComponent
                            key={tab.name}
                            tab={tab}
                            setHoveredTab={setHoveredTab}
                            hoveredTab={hoveredTab}
                        />)}
                        <Instagram transform={'translateY(-0.2rem)'} paddingLeft={15} />
                    </HeaderRightContainer>
                </NavContainer>
            )}
            <HorizontalLine width={'95%'} height={isHamburger ? '3rem' : '5rem'} color={'$darkGray'} />
        </HeaderContainer>
    );
};

export default Header;