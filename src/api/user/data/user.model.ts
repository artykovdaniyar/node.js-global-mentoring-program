import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import User from './user.entity';

const userSchema = new Schema({
	_id: {
		type: Schema.Types.UUID,
		default: () => uuidv4(),
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		index: true,
	},
	name: {
		type: String,
		required: true,
	},

	hobbies: {
		type: [String],
		default: [],
	},
});

const UserModel = model<User>('User', userSchema);

export default UserModel;
