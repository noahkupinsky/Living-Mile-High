import AspectImage from "@/components/images/AspectImage";
import { View } from "tamagui";

const Instagram = ({ ...props }: any) => {
    return (
        <View
            {...props}>
            <a href="https://instagram.com" style={{ cursor: "pointer" }}>
                <AspectImage
                    src="/instagram-logo.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                />
            </a>
        </View>
    );
};

export default Instagram