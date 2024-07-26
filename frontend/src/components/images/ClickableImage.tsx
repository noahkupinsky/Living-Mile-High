import { Image } from "tamagui";

type ClickableImageProps = {
    source: { uri: string; width: number; height: number };
    alt: string;
    onClick?: () => void;
    [key: string]: any;
}

const ClickableImage: React.FC<ClickableImageProps> = ({ source, alt, onClick, ...props }) => {

    return (
        <Image
            source={source}
            alt={alt}
            onPress={onClick}
            {...props}
        />
    );
}

export default ClickableImage;