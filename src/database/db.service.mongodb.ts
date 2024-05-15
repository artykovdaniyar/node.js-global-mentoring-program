import mongoose from 'mongoose';
import { IDBService } from './db.service.interface';

export class DBServiceMongoDB implements IDBService {
	constructor(private uri: string) {}

	public connect = async () => {
		try {
			await mongoose.connect(this.uri);
			console.log('Successfully connected to MongoDB');
		} catch (error: any) {
			console.log(`Error connecting to MongoDB: ${error.message}`);
		}
	};

	public disconnect = async () => {
		try {
			await mongoose.disconnect();
			console.log('Successfully disconnected from MongoDB');
		} catch (error: any) {
			console.log(`Error disconnecting from MongoDB: ${error.message}`);
		}
	};
}

const uri: string = process.env.DOMAIN || 'mongodb://localhost:27017/node-mentoring-program';

export const dbServiceMongoDB = new DBServiceMongoDB(uri);
