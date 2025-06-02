import mongoose from 'mongoose';

const IncSchema = new mongoose.Schema(
  {
    id: {
		type: String
	},
	seq: {
		type: Number
	}
  },
);

export default mongoose.model('Inc', IncSchema);
