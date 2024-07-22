import React, { useState } from 'react';
import { View, Button, styled } from 'tamagui';
import AspectImage from './AspectImage';

const CarouselContainer = styled(View, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
});

const MainImageContainer = styled(View, {
    marginBottom: 20,
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
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
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

    return (
        <CarouselContainer>
            <ArrowButton onPress={handlePrevious} style={{ left: 10 }}>◀</ArrowButton>
            <MainImageContainer>
                <AspectImage
                    src={images[currentIndex]}
                    alt="Main image"
                    height={300}
                />
            </MainImageContainer>
            <ArrowButton onPress={handleNext} style={{ right: 10 }}>▶</ArrowButton>
            <ThumbnailsContainer>
                {getVisibleThumbnails().map((thumbnail, index) => (
                    <ThumbnailContainer key={index}>
                        <AspectImage
                            alt={`Thumbnail ${index}`}
                            src={thumbnail}
                            height={50}
                            onClick={() => handleThumbnailClick((currentIndex + index - Math.floor(getVisibleThumbnails().length / 2) + images.length) % images.length)}
                        />
                    </ThumbnailContainer>
                ))}
            </ThumbnailsContainer>
        </CarouselContainer>
    );
};

export default ImageCarousel;