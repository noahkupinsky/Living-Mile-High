export interface ApiService {
    fetchData(route: string, params: Record<string, any> = {}): Promise<any>;
    verifyAuthenticated(): Promise<boolean>;
    login(username: string, password: string): Promise<boolean>;
}