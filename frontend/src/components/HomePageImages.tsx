import { HOME_PAGE_INTERVAL } from "@/config/constants";
import { useSiteData } from "@/contexts/SiteDataContext";
import services from "@/di";
import { useCallback, useEffect, useRef, useState } from "react";
import { styled, View, XStack } from "tamagui";
import { useResize } from "@/contexts/ResizeContext";
import AspectImage from "./images/AspectImage";

const ImageContainer = styled(View, {
    flex: 1,
    width: '96%',
    position: 'relative',
})

const HomePageImageContainer = styled(XStack, {
    style: {
        transition: 'opacity 0.5s ease-in-out',
    },
    opacity: 0,
    flex: 1,
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
});


const HomePageImages = () => {
    const { addResizeListener, removeResizeListener } = useResize();
    const { generalData } = useSiteData();
    const { cdnService } = services();
    const container = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [homePageImages, setHomePageImages] = useState<string[]>(cdnService.defaultHomePageImages());

    useEffect(() => {
        setHomePageImages(generalData ? generalData.homePageImages : cdnService.defaultHomePageImages());
    }, [generalData, cdnService]);

    const setDimensions = useCallback(() => {
        if (container.current) {
            setContainerWidth(container.current.offsetWidth);
            setContainerHeight(container.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % homePageImages.length);
        }, HOME_PAGE_INTERVAL);

        return () => clearInterval(timer);
    }, [homePageImages]);

    useEffect(() => {
        addResizeListener(setDimensions);
        return () => removeResizeListener(setDimensions);
    }, [setDimensions, addResizeListener, removeResizeListener]);

    useEffect(() => {
        setDimensions();
    }, [container, setDimensions]);

    return (
        <ImageContainer ref={container}>
            {homePageImages.map((image, index) => (
                <HomePageImageContainer
                    opacity={currentIndex === index ? 1 : 0}
                    key={image}
                >
                    <AspectImage
                        width={containerWidth}
                        height={containerHeight}
                        src={image} alt={"Couldn't load home page image"} />
                </HomePageImageContainer>
            ))}
        </ImageContainer>
    );
};

export default HomePageImages;