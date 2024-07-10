import { services } from "~/di";
import { StateService } from "~/@types/services";

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
