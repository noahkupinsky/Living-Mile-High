import mongoose, { Connection } from 'mongoose';

export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

class MongoDatabase {
    private mongoUri: string;
    private connection: Connection;

    constructor(uri: string) {
        this.mongoUri = uri;
    }

    async connect(): Promise<void> {
        await mongoose.connect(this.mongoUri, {});

        this.connection = mongoose.connection;
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.dropDatabase();
            await this.connection.close();
        }
    }
}

export default MongoDatabase;