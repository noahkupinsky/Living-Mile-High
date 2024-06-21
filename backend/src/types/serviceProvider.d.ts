export interface ServiceProvider<ServiceDict> {
    get services(): ServiceDict
}