'use client'

import { useSizing } from "@/contexts/SizingContext";
import { styled, YStack } from "tamagui"
import Loader from "./Loader";

const BodyContainer = styled(YStack, {
    width: '100%',
    alignItems: 'center',
})

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { bodyRef, sizingLoading, bodyHeight } = useSizing();


    return (
        <BodyContainer
            ref={bodyRef}
            minHeight={bodyHeight}
        >
            <Loader isLoading={sizingLoading}>
                {children}
            </Loader>
        </BodyContainer>
    );
}

export default Body;