import AspectImage from "@/components/images/AspectImage";
import { View, Image } from "tamagui";

const SIZE = 24;

const Instagram = ({ ...props }: any) => {
    return (
        <View
            {...props}>
            <a href="https://instagram.com" style={{ cursor: "pointer" }}>
                <Image
                    src="/instagram-logo.png"
                    alt="Instagram"
                    width={SIZE}
                    height={SIZE}
                />
            </a>
        </View>
    );
};

export default Instagram