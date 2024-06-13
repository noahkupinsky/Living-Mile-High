import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import { IAdminService } from './AdminService';
import { GOOGLE_CLIENT_ID, MASTER_PASSWORD_HASH } from '../env';

export interface IAuthService {
    verifyMasterPassword(password: string): Promise<boolean>;
    verifyGoogleToken(token: string): Promise<boolean>;
}

export class AuthService implements IAuthService {
    private client: OAuth2Client;
    private adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this.client = new OAuth2Client(GOOGLE_CLIENT_ID);
        this.adminService = adminService;
    }

    async verifyMasterPassword(password: string): Promise<boolean> {
        console.log(password, MASTER_PASSWORD_HASH);
        return bcrypt.compare(password, MASTER_PASSWORD_HASH);
    }

    async verifyGoogleToken(token: string): Promise<boolean> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload?.email;

            return !!email && await this.adminService.isAdmin(email);
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}