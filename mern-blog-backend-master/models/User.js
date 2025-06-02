import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			default: 0,
		},
		avatarUrl: String,
	},
);

export default mongoose.model('User', UserSchema);
