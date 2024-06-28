import { DeepPartial, DefaultAppData } from "living-mile-high-lib";
import { GeneralData, GeneralDataService } from "../types";
import GeneralDataModel, { GeneralDataDocument, generalDocumentToObject, generalPartialToUpsert } from "../models/GeneralDataModel";

class MongoGeneralDataService implements GeneralDataService {
    async update(updates: DeepPartial<GeneralData>): Promise<void> {
        const existing: GeneralDataDocument = await this.getSingletonDocument();
        const upsert: DeepPartial<GeneralDataDocument> = generalPartialToUpsert(updates);

        if (existing) {
            Object.assign(existing, upsert);
            await existing.save();
        } else {
            const newData = new GeneralDataModel(upsert);
            await newData.save();
        }
    }

    async getGeneralData(): Promise<GeneralData> {
        const singleton = await this.getSingletonDocument();
        return generalDocumentToObject(singleton);
    }

    private async getSingletonDocument(): Promise<GeneralDataDocument> {
        let data = await GeneralDataModel.findOne();
        if (!data) {
            data = new GeneralDataModel(generalPartialToUpsert(DefaultAppData));
            await data.save();
        }
        return data;
    }
}

export default MongoGeneralDataService