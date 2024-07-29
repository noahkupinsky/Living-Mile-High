import React, { useState } from 'react';
import { View, Button, styled, YStack, XStack } from 'tamagui';
import AspectImage from './AspectImage';
import { minV } from '@/utils/misc';
import { FADE_SHORT } from '@/config/constants';

const WIDTH_PERCENTAGE = 0.65;
const HEIGHT_PERCENTAGE = 0.65;
const THUMBNAIL_PERCENTAGE = 0.05;

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
    marginRight: 5,
});

const ArrowButton = styled(Button, {
    fontSize: '1rem',
});

type ImageCarouselProps = {
    images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
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
        const visibleCount = 5; // Adjust based on how many thumbnails you want to show
        const thumbnails = [];
        for (let i = -Math.floor(visibleCount / 2); i <= Math.floor(visibleCount / 2); i++) {
            const index = (currentIndex + i + images.length) % images.length;
            thumbnails.push(images[index]);
        }
        return thumbnails;
    };

    const mainWidth = window.innerWidth * WIDTH_PERCENTAGE;
    const mainHeight = window.innerHeight * HEIGHT_PERCENTAGE;
    const thumbnailHeight = window.innerHeight * THUMBNAIL_PERCENTAGE;

    return window && (
        <CarouselContainer>
            <ButtonColumn>
                <ArrowButton onPress={handlePrevious}>◀</ArrowButton>
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
                <ArrowButton onPress={handleNext}>▶</ArrowButton>
            </ButtonColumn>

        </CarouselContainer>
    );
};

export default ImageCarousel;