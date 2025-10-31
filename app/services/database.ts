import mongoose from 'mongoose';
import config from '../config/config.js';

class Database {
    private static instance: Database;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('Already connected to MongoDB');
            return;
        }

        try {
            await mongoose.connect(config.mongodbUri);
            this.isConnected = true;
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('MongoDB disconnected');
        } catch (error) {
            console.error('MongoDB disconnection error:', error);
            throw error;
        }
    }

    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export default Database;