import { Schema, model, Document } from 'mongoose';
import { HouseRecord } from 'src/@types';

interface HouseDocument extends Document, HouseRecord { }

const HouseSchema = new Schema<HouseDocument>({
    address: { type: String, required: true },
});

const HouseModel = model<HouseDocument>('Admin', HouseSchema);

export default HouseModel;
