import { INSTA_URL } from "@/config/constants";
import { View, Image } from "tamagui";

type InstagramProps = {
    size: number;
    [key: string]: any;
}

const Instagram: React.FC<InstagramProps> = ({ size, ...props }) => {
    return (
        <View
            {...props}>
            <a href={INSTA_URL} style={{ cursor: "pointer" }}>
                <Image
                    src="/instagram-logo.png"
                    alt="Instagram"
                    width={size}
                    height={size}
                />
            </a>
        </View>
    );
};

export default Instagram