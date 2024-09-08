'use client';

import { Text, styled, View, XStack, Image, YStack } from 'tamagui';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import HamburgerMenu from './HamburgerMenu';
import { filterNavTabs } from '@/config/pageConfig';
import { useAuth } from '@/contexts/AuthContext';
import NavTabComponent from './NavTabComponent';
import Instagram from './Instagram';
import { HeaderFooterHorizontalLine } from '../LayoutComponents';
import { FADE_SHORT } from '@/config/constants';
import { useSizing } from '@/contexts/SizingContext';
import { minV } from '@/utils/misc';

const LOGO_SIZE = minV(11);
const HORIZONTAL_PADDING = '3vw';
const TITLE_PERCENTAGE = 0.03;
const SPACING_PERCENTAGE = 0.3;
const TITLE_MINIMUM_SIZE = 0.5;
const TITLE_MAXIMUM_SIZE = 1.8;
const HAMBURGER_SIZE = 30;
const INSTAGRAM_SIZE = 30;

const HeaderContainer = styled(YStack, {
    width: '100%',
    style: {
        transition: FADE_SHORT,
    }
});

const NavContainer = styled(XStack, {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const HeaderLeftContainer = styled(XStack, {
    paddingLeft: HORIZONTAL_PADDING,
    justifyContent: 'flex-start',
    alignItems: 'center',
})

const HeaderRightContainer = styled(XStack, {
    paddingRight: HORIZONTAL_PADDING,
    justifyContent: 'flex-end',
    alignItems: 'center',
})

const HeaderText = styled(Text, {
    fontFamily: '$sc',
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
                    uri: "/company-logo.jpg",
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
    const [titleFontSize, setTitleFontSize] = useState<any>(`${TITLE_MINIMUM_SIZE}rem`);
    const [titleLetterSpacing, setTitleLetterSpacing] = useState<any>(`${TITLE_MINIMUM_SIZE * SPACING_PERCENTAGE}rem`);

    const { headerRef } = useSizing();
    // for use in wide mode, for determining when to toggle narrow mode
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    //for use in narrow mode, for determining title font size
    const titleRef = useRef<HTMLDivElement>(null);

    const tabs = useMemo(() => filterNavTabs(isAuthenticated), [isAuthenticated]);

    const handleResize = useCallback(() => {
        if (!headerRef.current) {
            return;
        }

        const headerWidth = headerRef.current.offsetWidth;
        const currentLeftWidth = leftRef.current ? leftRef.current.scrollWidth : leftWidth !== null ? leftWidth : 0;
        const currentRightWidth = rightRef.current ? rightRef.current.scrollWidth : rightWidth !== null ? rightWidth : 0;

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

    }, [headerRef, isHamburger, leftWidth, rightWidth]);

    const handleTitleSize = useCallback(() => {
        if (!isHamburger || !titleRef.current) {
            return;
        }
        const titleWidth = titleRef.current.offsetWidth;

        const titleSize = (titleWidth * TITLE_PERCENTAGE).toFixed(2);
        const titleSizeString = `max(${TITLE_MINIMUM_SIZE}rem, min(${TITLE_MAXIMUM_SIZE}rem, ${titleSize}px))`;

        const titleSpacing = (titleWidth * TITLE_PERCENTAGE * SPACING_PERCENTAGE).toFixed(2);
        const minSpacing = TITLE_MINIMUM_SIZE * SPACING_PERCENTAGE;
        const maxSpacing = TITLE_MAXIMUM_SIZE * SPACING_PERCENTAGE;
        const titleSpacingString = `max(${minSpacing}rem, min(${maxSpacing}rem, ${titleSpacing}px))`;

        setTitleFontSize(titleSizeString);
        setTitleLetterSpacing(titleSpacingString);
    }, [isHamburger]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleResize);
        const currentHeader = headerRef.current;

        if (currentHeader) {
            resizeObserver.observe(currentHeader);
        }

        handleResize();

        return () => {
            if (currentHeader) {
                resizeObserver.unobserve(currentHeader);
            }
        };
    }, [handleResize, headerRef]);

    useEffect(() => {
        const titleObserver = new ResizeObserver(handleTitleSize);
        const currentTitle = titleRef.current;

        if (currentTitle) {
            titleObserver.observe(currentTitle);
        }

        handleTitleSize();

        return () => {
            if (currentTitle) {
                titleObserver.unobserve(currentTitle);
            }
        };

    }, [handleTitleSize]);


    const headerName = pathname === '/' ? 'HOME' : tabs.find(tab => pathname.startsWith(tab.path))?.name.toLocaleUpperCase() || '';

    return (
        <HeaderContainer
            opacity={isResolved ? 1 : 0}
            ref={headerRef}
        >
            {isHamburger ? (
                <View style={{ flex: 1 }} ref={titleRef} >
                    <NavContainer
                        key={"narrow"}
                        height={`max(${LOGO_SIZE}, ${HAMBURGER_SIZE}px)`}
                    >
                        <HeaderLeftContainer>
                            <SquareLogo size={LOGO_SIZE} />
                        </HeaderLeftContainer>
                        <HeaderText
                            fontSize={titleFontSize}
                            letterSpacing={titleLetterSpacing}
                        >
                            {headerName}
                        </HeaderText>
                        <HeaderRightContainer>
                            <HamburgerMenu
                                setHoveredTab={setHoveredTab}
                                hoveredTab={hoveredTab}
                                tabs={tabs}
                                size={HAMBURGER_SIZE}
                            />
                        </HeaderRightContainer>
                    </NavContainer>
                </View>
            ) : (
                <NavContainer
                    key={"wide"}
                    height={`max(${LOGO_SIZE}, ${INSTAGRAM_SIZE}px)`} >
                    <HeaderLeftContainer ref={leftRef}>
                        <SquareLogo
                            size={LOGO_SIZE} />
                    </HeaderLeftContainer>
                    <HeaderRightContainer ref={rightRef}>
                        <XStack
                            alignItems='center'>
                            {tabs.map(tab => <NavTabComponent
                                key={tab.name}
                                tab={tab}
                                setHoveredTab={setHoveredTab}
                                hoveredTab={hoveredTab}
                            />)}
                        </XStack>
                        <Instagram
                            paddingLeft={15}
                            size={INSTAGRAM_SIZE}
                        />
                    </HeaderRightContainer>
                </NavContainer>
            )}
            <HeaderFooterHorizontalLine />
        </HeaderContainer>
    );
};

export default Header;