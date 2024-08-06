import { FADE_MEDIUM, HOME_PAGE_INTERVAL } from "@/config/constants";
import { useSiteData } from "@/contexts/SiteDataContext";
import services from "@/di";
import { useEffect, useState } from "react";
import { styled, View, XStack } from "tamagui";
import AspectImage from "./images/AspectImage";
import { useSizing } from "@/contexts/SizingContext";
import { useServices } from "@/contexts/ServiceContext";

const WIDTH_PERCENTAGE = 0.95;
const HEIGHT_PERCENTAGE = 0.95;

const ImageContainer = styled(View, {
    flex: 1,
    width: '100%',
    position: 'relative',
})

const HomePageImageContainer = styled(XStack, {
    style: {
        transition: FADE_MEDIUM,
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
    const { generalData } = useSiteData();
    const { cdnService } = useServices();
    const { bodyWidth, bodyHeight } = useSizing();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [homePageImages, setHomePageImages] = useState<string[]>(cdnService.defaultHomePageImages());

    useEffect(() => {
        setHomePageImages(generalData ? generalData.homePageImages : cdnService.defaultHomePageImages());
    }, [generalData, cdnService]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % homePageImages.length);
        }, HOME_PAGE_INTERVAL);

        return () => clearInterval(timer);
    }, [homePageImages]);

    return (
        <ImageContainer>
            {homePageImages.map((image, index) => (
                <HomePageImageContainer
                    opacity={currentIndex === index ? 1 : 0}
                    key={image}
                >
                    <AspectImage
                        width={bodyWidth * WIDTH_PERCENTAGE}
                        height={bodyHeight * HEIGHT_PERCENTAGE}
                        src={image} alt={"Couldn't load home page image"} />
                </HomePageImageContainer>
            ))}
        </ImageContainer>
    );
};

export default HomePageImages;