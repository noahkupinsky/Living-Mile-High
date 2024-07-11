import { DeepPartial, DefaultGeneralData } from "living-mile-high-lib";
import { GeneralData, GeneralDataService } from "~/@types";
import GeneralDataModel, { GeneralDataDocument, generalDocumentToObject, generalObjectToNewDocument } from "~/models/GeneralDataModel";
import { constructUpdateObject } from "~/utils/misc";

export class MongoGeneralDataService implements GeneralDataService {
    async update(updates: DeepPartial<GeneralData>): Promise<void> {
        const existing: GeneralDataDocument = await this.getSingletonDocument();

        const updateFields: DeepPartial<GeneralDataDocument> = constructUpdateObject(updates);

        await GeneralDataModel.findByIdAndUpdate(existing._id, { $set: updateFields }, { new: true });
    }

    async getGeneralData(): Promise<GeneralData> {
        const singleton = await this.getSingletonDocument();

        return generalDocumentToObject(singleton);
    }

    private async getSingletonDocument(): Promise<GeneralDataDocument> {
        let data = await GeneralDataModel.findOne();
        if (!data) {
            const doc = generalObjectToNewDocument(DefaultGeneralData);
            data = new GeneralDataModel(doc);
            await data.save();
        }
        return data;
    }
}