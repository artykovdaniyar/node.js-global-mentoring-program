import mongoose, { Error } from 'mongoose';

export class MongoDBService {
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

const uri: string = 'mongodb://localhost:27017/node-mentoring-program';

export const mongoDBService = new MongoDBService(uri);
