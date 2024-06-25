import { DeepPartial, DefaultAppData } from "living-mile-high-lib";
import { OtherData, OtherService } from "../types";
import OtherModel, { OtherDocument, otherDocumentToObject, otherPartialToUpsert } from "../models/OtherModel";

class MongoOtherService implements OtherService {
    async update(updates: DeepPartial<OtherData>): Promise<void> {
        const existing: OtherDocument = await this.getSingletonDocument();
        const upsert: DeepPartial<OtherDocument> = otherPartialToUpsert(updates);

        if (existing) {
            Object.assign(existing, upsert);
            await existing.save();
        } else {
            const newData = new OtherModel(upsert);
            await newData.save();
        }
    }

    async getOtherObject(): Promise<OtherData> {
        const singleton = await this.getSingletonDocument();
        return otherDocumentToObject(singleton);
    }

    private async getSingletonDocument(): Promise<OtherDocument> {
        let data = await OtherModel.findOne();
        if (!data) {
            data = new OtherModel(otherPartialToUpsert(DefaultAppData));
            await data.save();
        }
        return data;
    }
}

export default MongoOtherService