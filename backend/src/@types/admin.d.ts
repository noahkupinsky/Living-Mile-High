
export interface AdminRecord {
    username: string;
    password: string;
}// IAdminService.ts

export interface AdminService {
    getUserByLoginInfo(username: string, password: string): Promise<any>;
    createUser(username: string, password: string): Promise<any>;
    getUserById(id: string): Promise<any>;
}

