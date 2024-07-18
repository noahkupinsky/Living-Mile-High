import { HOME_PAGE_INTERVAL } from "@/config/constants";
import { useSiteData } from "@/contexts/SiteDataContext";
import services from "@/di";
import { useEffect, useState } from "react";
import { AutoImage } from "./images/AutoImage";


const HomePageImages = () => {
    const { generalData } = useSiteData();
    const { cdnService } = services();

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [homePageImages, setHomePageImages] = useState<string[]>(cdnService.defaultHomePageImages());

    const currentImage = homePageImages[currentIndex];

    useEffect(() => {
        setHomePageImages(generalData ? generalData.homePageImages : cdnService.defaultHomePageImages());
    }, [generalData, cdnService]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % homePageImages.length);
        }, HOME_PAGE_INTERVAL);

        return () => clearInterval(timer);
    }, [homePageImages]);

    return (
        <div>
            <AutoImage src={currentImage} alt={"Couldn't load home page image"} />
        </div>
    );
};

export default HomePageImages;