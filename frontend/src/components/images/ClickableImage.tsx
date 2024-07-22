import { Image, styled } from "tamagui";

const StyledImage = styled(Image, {
    name: 'StyledImage',
});

type ClickableImageProps = {
    source: { uri: string; width: number; height: number };
    alt: string;
    onClick?: () => void;
}

const ClickableImage: React.FC<ClickableImageProps> = ({ source, alt, onClick, ...props }) => {
    return (
        <StyledImage
            source={source}
            alt={alt}
            onClick={onClick}
            {...props}
        />
    );
}

export default ClickableImage;