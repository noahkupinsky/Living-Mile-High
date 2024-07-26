import { NavTab } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { styled, XStack, Text } from "tamagui";

const StyledTabContainer = styled(XStack, {
    cursor: 'pointer',
    padding: 10
});

const StyledTabText = styled(Text, {
    fontFamily: '$caps',
    fontSize: '$3',
});

type NavTabComponentProps = {
    tab: NavTab;
    setHoveredTab: React.Dispatch<React.SetStateAction<string | null>>;
    hoveredTab: string | null;
};

const NavTabComponent: React.FC<NavTabComponentProps> = ({ tab, setHoveredTab, hoveredTab }) => {
    const pathname = usePathname();
    const router = useRouter();
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
            onMouseEnter={() => setHoveredTab(tab.name)}
            onMouseLeave={() => setHoveredTab(null)}
        >
            <StyledTabText color={color} style={{ transition: 'color 0.3s ease' }}>
                {tab.name.toLocaleUpperCase()}
            </StyledTabText>
        </StyledTabContainer>
    );
};

export default NavTabComponent;
