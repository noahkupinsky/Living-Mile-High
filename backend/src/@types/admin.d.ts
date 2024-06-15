
export interface AdminRecord {
    username: string;
    password: string;
}// IAdminService.ts

export interface AdminService {
    async getUserByLoginInfo(username: string, password: string): Promise<any>;
    async createUser(username: string, password: string): Promise<any>;
    async getUserById(id: string): Promise<any>;
}

