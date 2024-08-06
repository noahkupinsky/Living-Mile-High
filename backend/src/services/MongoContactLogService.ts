import { ContactLogRecord } from "~/@types/database";
import { ContactLogService } from "~/@types/dbServices";
import ContactLogModel from "~/models/ContactLogModel";

export class MongoContactLogService implements ContactLogService {
    async logEmail(log: ContactLogRecord): Promise<void> {
        await ContactLogModel.create(log);
    }

    async canSendEmail(log: ContactLogRecord): Promise<boolean> {
        const matchingIp = await ContactLogModel.findOne({ ip: log.ip });

        const matchingEmail = await ContactLogModel.findOne({ email: log.email });

        return !matchingIp && !matchingEmail;
    }
}