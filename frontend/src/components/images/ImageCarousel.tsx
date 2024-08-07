import React, { useState } from 'react';
import { View, Button, styled, YStack, XStack } from 'tamagui';
import AspectImage from './AspectImage';
import { minV } from '@/utils/misc';
import { FADE_SHORT } from '@/config/constants';
import { useSizing } from '@/contexts/SizingContext';

const WIDTH_PERCENTAGE = 0.60;
const HEIGHT_PERCENTAGE = 0.8;
const THUMBNAIL_PERCENTAGE = 0.05;
const MAX_THUMBNAILS = 10;

const CarouselContainer = styled(XStack, {
    alignItems: 'center',
    padding: minV(2),
    borderRadius: '1rem',
});

const ImageColumn = styled(YStack, {
    alignItems: 'center',
})

const ButtonColumn = styled(YStack, {
    alignItems: 'center',
    justifyContent: 'center',
});

const MainImagesContainer = styled(YStack, {
    margin: minV(2),
    alignItems: 'center',
});

const MainImageContainer = styled(XStack, {
    style: {
        transition: FADE_SHORT,
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

const ThumbnailsContainer = styled(View, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
});

const ThumbnailContainer = styled(View, {
    cursor: 'pointer',
    marginHorizontal: minV(0.5),
});

const ArrowButton = styled(Button, {
    height: 'min(7vw, 10rem)',
    width: 'min(7vw, 10rem)',
    paddingHorizontal: 'min(1vw, 1rem)',
    fontSize: '3vw',
});

type ImageCarouselProps = {
    images: string[];
}

const ARROW_PERCENTAGE = '70%';

const LeftArrowSVG = () => (
    <svg width={ARROW_PERCENTAGE} height={ARROW_PERCENTAGE} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="0,50 100,10 100,90" fill="white" />
    </svg>
);

const RightArrowSVG = () => (
    <svg width={ARROW_PERCENTAGE} height={ARROW_PERCENTAGE} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="0,10 100,50 0,90" fill="white" />
    </svg>
);

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const { bodyWidth, bodyHeight } = useSizing();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    const getVisibleThumbnails = () => {
        const visibleCount = Math.min(MAX_THUMBNAILS, images.length); // Adjust based on how many thumbnails you want to show
        const thumbnails = [];
        for (let i = -Math.floor(visibleCount / 2); i <= Math.floor(visibleCount / 2); i++) {
            const index = (currentIndex + i + images.length) % images.length;
            thumbnails.push(images[index]);
        }
        return thumbnails;
    };

    const mainWidth = bodyWidth * WIDTH_PERCENTAGE;
    const mainHeight = bodyHeight * HEIGHT_PERCENTAGE;
    const thumbnailHeight = bodyHeight * THUMBNAIL_PERCENTAGE;

    return window && (
        <CarouselContainer>
            <ButtonColumn>
                <ArrowButton onPress={handlePrevious}>
                    <LeftArrowSVG />
                </ArrowButton>
            </ButtonColumn>
            <ImageColumn>

                <MainImagesContainer
                    width={mainWidth}
                    height={mainHeight}
                >
                    {images.map((image, index) => (
                        <MainImageContainer
                            opacity={currentIndex === index ? 1 : 0}
                            key={image}
                        >
                            <AspectImage
                                width={mainWidth}
                                height={mainHeight}
                                src={image} alt={"Couldn't load home page image"} />
                        </MainImageContainer>
                    ))}
                </MainImagesContainer>

                <ThumbnailsContainer>
                    {getVisibleThumbnails().map((thumbnail, index) => (
                        <ThumbnailContainer key={index}>
                            <AspectImage
                                alt={`Thumbnail ${index}`}
                                src={thumbnail}
                                height={thumbnailHeight}
                                onClick={() => handleThumbnailClick((currentIndex + index - Math.floor(getVisibleThumbnails().length / 2) + images.length) % images.length)}
                            />
                        </ThumbnailContainer>
                    ))}
                </ThumbnailsContainer>
            </ImageColumn>
            <ButtonColumn>
                <ArrowButton onPress={handleNext}>
                    <RightArrowSVG />
                </ArrowButton>
            </ButtonColumn>

        </CarouselContainer>
    );
};

export default ImageCarousel;