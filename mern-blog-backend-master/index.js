import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController, AppliesController } from './controllers/index.js';

mongoose
	.connect("mongodb+srv://test:test123@cluster0.imrxrhc.mongodb.net/blog?retryWrites=true&w=majority")
	// .connect(process.env.MONGODB_URI)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err));

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get('/role/:email', PostController.changeRole);
app.get('/book/:id', PostController.getApplyByTitle);
app.get('/applies/:type/:status/', PostController.getApplies);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
	'/posts/:id',
	checkAuth,
	handleValidationErrors,
	PostController.update,
);

app.post('/apps', checkAuth, postCreateValidation, handleValidationErrors, AppliesController.create);
app.delete('/apps/:id', checkAuth, AppliesController.remove);
app.patch(
	'/apps/:id',
	checkAuth,
	handleValidationErrors,
	AppliesController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
