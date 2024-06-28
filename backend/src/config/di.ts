import AppServiceProvider from "../service_managers/RealServiceManager";
import MockServiceManager from "../service_managers/MockServiceManager";

const newServiceManager = (mock = false) => {
    return mock ? new MockServiceManager() : new AppServiceProvider();
}

export default newServiceManager