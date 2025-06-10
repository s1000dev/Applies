import PostModel from '../models/Concern.js';
import UserModel from '../models/User.js';
import IncModel from '../models/Inc.js';
import ApplyModel from '../models/Apply.js';

export const create = async (req, res) => {

	try {

		IncModel.findOneAndUpdate(
			{ id: 'autoval' },
			{ '$inc': { 'seq': 1 } },
			{ new: true }, (err, cd) => {

				let seqId;
				if (cd == null) {
					const newval = new IncModel({ id: 'autoval', seq: 0 })
					seqId = 0;
					newval.save();
				} else {
					seqId = cd.seq;
				}

				const doc = new ApplyModel({
					title: req.body.title,
					phone: req.body.phone,
					text: req.body.text,
					user: req.userId,
					num: seqId,
				});

				const post = doc.save();
				res.json(post);
			}

		);


	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Ошибка при создании заявки',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		ApplyModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: 'Ошибка при удалении заявки',
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Заявка не найдена',
					});
				}

				res.json({
					success: true,
				});
			},
		);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Error while deleting a book',
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await ApplyModel.updateOne(
			{
				_id: postId,
			},
			{
				status: req.body.status,
			},
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Ошибка при обновлении заявки',
		});
	}
};

export const getOneApply = async (req, res) => {
	try {
		const postId = req.params.id;

		ApplyModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: 'Ошибка при получении заявки',
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Заявка не найдена',
					});
				}

				res.json(doc);
			},
		).populate('user');
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Ошибка при получении заявки',
		});
	}
};