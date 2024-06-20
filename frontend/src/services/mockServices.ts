import { Services } from "@/types";

const mockServices = (): Services => {
    return {
        apiService: {
            fetch: () => Promise.resolve({}),
            verifyAuthenticated: () => Promise.resolve(true),
            login: () => Promise.resolve(true)
        }
    };
}

export default mockServices