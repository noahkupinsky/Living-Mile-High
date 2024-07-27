'use client'

import { useSizing } from "@/contexts/SizingContext";
import { styled, YStack } from "tamagui"
import Loader from "./Loader";

const BodyContainer = styled(YStack, {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
})

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { bodyRef, sizingLoading: bodyLoading } = useSizing();
    return (
        <BodyContainer ref={bodyRef}>
            <Loader isLoading={bodyLoading}>
                {children}
            </Loader>
        </BodyContainer>
    );
}

export default Body;