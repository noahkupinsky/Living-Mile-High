import AppServiceProvider from "./AppServiceManager";
import MockServiceManager from "./MockServiceManager";

const newServiceManager = (mock = false) => {
    return mock ? new MockServiceManager() : new AppServiceProvider();
}

export default newServiceManager