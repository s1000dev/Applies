import PostModel from '../models/Concern.js';
import UserModel from '../models/User.js';
import ApplyModel from '../models/Apply.js'
import IncModel from '../models/Inc.js';

export const changeRole = async (req, res) => {

	try {
		const userEmail = String(req.params.email).toLowerCase();

		let user = await UserModel.findOne({ email: userEmail, });

		const userRole = user.role;
		if (userRole == 0) {
			await UserModel.updateOne(
				{
					email: userEmail,
				},
				{
					role: 1,
				},
			);
		} else {
			await UserModel.updateOne(
				{
					email: userEmail,
				},
				{
					role: 0,
				},
			);
		}

		res.json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Ошибка при смене прав пользователя',
		});
	}
};

export const getApplyByTitle = async (req, res) => {

	try {
		const bookName = req.params.id.toLowerCase();
		let posts = [];
		let applies = [];
		let posts1 = [];
		let sorted = [];

		posts1 = await PostModel.find().exec();
		applies = await ApplyModel.find().exec();
		posts = [...posts1, ...applies];
		posts = [...posts1, ...applies].sort((a, b) => {
			return new Date(b.createdAt) - new Date(a.createdAt); // Явное преобразование в Date
		});
		posts.map((obj) => {
			if (obj.title.toLowerCase().includes(bookName)) {
				sorted.push(obj);
			}
		})
			.flat()

		res.json(sorted);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Ошибка при получении заявки по названию',
		});
	}
};

export const getApplies = async (req, res) => {

	try {
		const type = req.params.type;
		const statusParam = req.params.status;
		let posts;
		let applies = [];
		let posts1 = [];
		let sorted = [];

		if (statusParam == 4) {
			if (type == 'all') {
				posts1 = await PostModel.find().populate('user').exec();
				applies = await ApplyModel.find().populate('user').exec();
			} else if (type == 'tech') {
				applies = await PostModel.find().populate('user').exec();
			} else if (type == 'market') {
				posts1 = await ApplyModel.find().populate('user').exec();
			}
		} else {
			if (type == 'all') {
				posts1 = await PostModel.find({ status: statusParam }).populate('user').exec();
				applies = await ApplyModel.find({ status: statusParam }).populate('user').exec();
			} else if (type == 'tech') {
				applies = await PostModel.find({ status: statusParam }).populate('user').exec();
			} else if (type == 'market') {
				posts1 = await ApplyModel.find({ status: statusParam }).populate('user').exec();
			}
		}


		posts = [...posts1, ...applies];
		posts = [...posts1, ...applies].sort((a, b) => {
			return new Date(b.createdAt) - new Date(a.createdAt); // Явное преобразование в Date
		});
		if (posts?.length) {
			for (let i = 0; i < posts.length; i++) {
				sorted.push(posts[i]);
			}
		}

		res.json(sorted);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Ошибка при получении заявки',
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndUpdate(
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

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndDelete(
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

				const doc = new PostModel({
					title: req.body.title,
					text: req.body.text,
					inventory: req.body.inventory || 'не указан',
					imageUrl: req.body.imageUrl,
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

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				worker: req.body.worker,
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