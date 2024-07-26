'use client';

import { Text, styled, View, XStack } from 'tamagui';
import { usePathname, useRouter } from 'next/navigation';
import { useResize } from '@/contexts/ResizeContext';
import { useRef, useState, useEffect, useCallback } from 'react';
import HamburgerMenu from './HamburgerMenu';
import HorizontalLine from '../HorizontalLine';
import AspectImage from '@/components/images/AspectImage';
import { filterNavTabs } from '@/config/navTabs';
import { useAuth } from '@/contexts/AuthContext';
import NavTabComponent from './NavTabComponent';
import Instagram from './Instagram';

const HeaderContainer = styled(View, {
    width: '100%',
    paddingTop: '2%',
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

const HeaderText = styled(Text, {
    fontFamily: '$caps',
    fontSize: '$5',
    color: '$darkGray'
})

const SquareLogo = ({ size }: { size: number }) => {
    const router = useRouter();

    return (
        <AspectImage
            onClick={() => router.push('/')}
            src="/company-logo.png"
            alt="Company Logo"
            cursor="pointer"
            width={size}
            height={size}
        />
    );

}

const Header = () => {
    const { isAuthenticated } = useAuth();
    const { addResizeListener, removeResizeListener } = useResize();
    const pathname = usePathname();
    const [isResolved, setIsResolved] = useState(false);
    const [isHamburger, setIsHamburger] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [rightWidth, setRightWidth] = useState<number | null>(null);
    const [leftWidth, setLeftWidth] = useState<number | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

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
    }, [addResizeListener, removeResizeListener, checkDimensions]);

    const tabs = filterNavTabs(isAuthenticated);
    const headerName = tabs.find(tab => pathname.startsWith(tab.path))?.name.toLocaleUpperCase() || '';

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
                    <HeaderLeftContainer >
                        <SquareLogo size={75} />
                    </HeaderLeftContainer>
                    <HeaderText>{headerName}</HeaderText>
                    <HeaderRightContainer>
                        <HamburgerMenu
                            setHoveredTab={setHoveredTab}
                            hoveredTab={hoveredTab}
                            tabs={tabs}
                        />
                    </HeaderRightContainer>
                </HamburgerHeaderContainer>
            ) : (
                <WideHeaderContainer>
                    <HeaderLeftContainer ref={leftRef}>
                        <SquareLogo size={100} />
                    </HeaderLeftContainer>
                    <HeaderRightContainer ref={rightRef}>
                        <View
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {tabs.map(tab => <NavTabComponent
                                key={tab.name}
                                tab={tab}
                                setHoveredTab={setHoveredTab}
                                hoveredTab={hoveredTab}
                            />)}
                            <Instagram paddingLeft={15} />
                        </View>
                    </HeaderRightContainer>
                </WideHeaderContainer>
            )}
            <HorizontalLine width={'80%'} height={'5%'} color={'$lightGray'} />
        </HeaderContainer>
    );
};

export default Header;