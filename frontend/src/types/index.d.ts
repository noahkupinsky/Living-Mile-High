export interface ApiService {
    fetch(route: string, params: Record<string, any> = {}): Promise<any>;
    verifyAuthenticated(): Promise<boolean>;
    login(username: string, password: string): Promise<boolean>;
}

export type Services = {
    apiService: ApiService;
}

export type SiteEventHandler = (data: any) => void