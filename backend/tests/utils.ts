import { GeneralData, House } from "living-mile-high-lib"

const defaultMockGeneralData: GeneralData = {
    about: {
        text: "about",
        image: "https://placehold.co/400"
    },
    contact: {
        text: "contact",
        image: "https://placehold.co/400"
    },
    defaultImages: ["https://placehold.co/400"],
    homePageImages: ["https://placehold.co/400", "https://placehold.co/500"]
}

const defaultMockHouseData: House = {
    isDeveloped: false,
    isForSale: false,
    isSelectedWork: false,
    address: "1 Example Road",
    mainImage: "https://placehold.co/600",
    images: ["https://placehold.co/500"],
    neighborhood: "",
    stats: { houseSquareFeet: 10 }
}

const mockGeneralData = (data: Partial<GeneralData>): GeneralData => {
    return { ...defaultMockGeneralData, ...data }
}

const mockHouseData = (data: Partial<House>): House => {
    return { ...defaultMockHouseData, ...data }
}

export { mockGeneralData, mockHouseData }