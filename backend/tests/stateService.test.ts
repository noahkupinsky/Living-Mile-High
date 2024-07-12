import { services } from "~/di";
import { StateService } from "~/@types";
import HouseModel from "~/models/HouseModel";
import GeneralDataModel from "~/models/GeneralDataModel";

let stateService: StateService;

beforeAll(() => {
    ({ stateService } = services());
});

describe('StateService', () => {

    it('should get state', async () => {
        const state = await stateService.getState();
        expect(state).not.toBeNull();
    })

    it('should serialize state', async () => {
        const houseData = await HouseModel.find().lean().exec();
        const generalData = await GeneralDataModel.find().lean().exec();

        const state = await stateService.serializeState();
        const { houseData: houseDataFromState, generalData: generalDataFromState } = JSON.parse(state);

        expect(houseDataFromState).toEqual(houseData);
        expect(generalDataFromState).toEqual(generalData);
    })

    it('should deserialize state', async () => {
        const originalHouseData = await HouseModel.find().lean().exec();
        const originalGeneralData = await GeneralDataModel.find().lean().exec();

        const state = await stateService.serializeState();
        await stateService.deserializeState(state);

        const deserializedHouseData = await HouseModel.find().lean().exec();
        const deserializedGeneralData = await GeneralDataModel.find().lean().exec();

        expect(deserializedHouseData).toEqual(originalHouseData);
        expect(deserializedGeneralData).toEqual(originalGeneralData);
    })
})
