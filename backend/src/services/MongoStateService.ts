import { SiteData } from "living-mile-high-lib";
import { GeneralDataService, HouseService, StateService } from "../types/services";
import HouseModel from "../models/HouseModel";
import GeneralDataModel from "../models/GeneralDataModel";

class MongoStateService implements StateService {
    private houseService: HouseService;
    private generalDataService: GeneralDataService;

    constructor(houseService: HouseService, generalDataService: GeneralDataService) {
        this.houseService = houseService;
        this.generalDataService = generalDataService;
    }
    async getState(): Promise<SiteData> {
        const houseData = await this.houseService.getHouseObjects();
        const generalData = await this.generalDataService.getGeneralData();
        const siteData = { ...generalData, houses: houseData }

        return siteData
    }

    async serializeState(): Promise<string> {
        const houseData = await HouseModel.find().lean().exec();
        const generalData = await GeneralDataModel.find().lean().exec();

        return JSON.stringify({ houseData: houseData, generalData: generalData });
    }

    async deserializeState(state: string): Promise<void> {
        const { houseData, generalData } = JSON.parse(state);

        await HouseModel.deleteMany({});
        await GeneralDataModel.deleteMany({});

        await HouseModel.insertMany(houseData);
        await GeneralDataModel.insertMany(generalData);
    }
}




export default MongoStateService