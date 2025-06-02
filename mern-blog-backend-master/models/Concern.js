import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		inventory: {
			type: String,
			default: 'не указан',
		},
		num: {
			type: Number,
			required: true,
		},
		worker: {
			type: String,
			default: 'не назначен',
		},
		status: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Concern', ApplicationSchema);
