import { GeneralData, House } from "living-mile-high-lib";
import { services } from "../src/app";
import { StateService } from "../src/types/services";

let stateService: StateService;

beforeAll(() => {
    stateService = services().stateService;
});

describe('StateService', () => {

    it('should get state', async () => {
        const state = await stateService.getState();
        expect(state).not.toBeNull();
    })
})
