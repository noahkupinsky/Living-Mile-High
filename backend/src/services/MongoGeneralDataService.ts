import { DeepPartial, DefaultGeneralData } from "living-mile-high-lib";
import { GeneralData, GeneralDataService } from "~/@types";
import GeneralDataModel, { GeneralDataDocument, generalDocumentToObject, generalObjectToDocument } from "~/models/GeneralDataModel";
import withLock from "~/utils/locks";
import { mergeDeepPartial } from "~/utils/misc";
import * as SiteDataValidator from "~/utils/SiteDataValidator";

export class MongoGeneralDataService implements GeneralDataService {
    async update(updates: DeepPartial<GeneralData>): Promise<void> {
        await withLock("general", async () => {
            const singletonDocument: GeneralDataDocument = await this.getSingletonDocument();
            const singletonId = singletonDocument._id;

            const singletonObject = generalDocumentToObject(singletonDocument);
            const updatedObject = mergeDeepPartial(singletonObject, updates);

            SiteDataValidator.validateGeneralData(updatedObject);
            const updateDocument = generalObjectToDocument(updatedObject);

            await GeneralDataModel.findByIdAndUpdate(singletonId, updateDocument);
        });
    }

    async getGeneralData(): Promise<GeneralData> {
        const singleton = await this.getSingletonDocument();

        return generalDocumentToObject(singleton);
    }

    private async getSingletonDocument(): Promise<GeneralDataDocument> {
        let data = await GeneralDataModel.findOne();
        if (!data) {
            const doc = generalObjectToDocument(DefaultGeneralData);
            data = new GeneralDataModel(doc);
            await data.save();
        }
        return data;
    }
}