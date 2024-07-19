import { House } from "living-mile-high-lib";

export const calculateMaxHeight = async (houses: House[], width: number): Promise<number> => {
    const heights = await Promise.all(
        houses.map((house) => {
            return new Promise<number>((resolve) => {
                const img = new window.Image();
                img.src = house.mainImage;
                img.onload = () => {
                    const aspectRatio = img.width / img.height;
                    const height = width / aspectRatio;
                    resolve(height);
                };
            });
        })
    );
    return Math.max(...heights);
};