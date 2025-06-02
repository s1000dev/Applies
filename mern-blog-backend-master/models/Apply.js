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
		phone: {
			type: String,
			required: true,
		},
		num: {
			type: Number,
			required: true,
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
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Apply', ApplicationSchema);
