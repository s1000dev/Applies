import React from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios'
import Select from 'react-select'

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import styles from './AddPost.module.scss';
import { keyframes } from '@emotion/react';

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(state => state.auth.data);

	const [isLoading, setLoading] = React.useState(false);
	const [text, setText] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [worker, setWorker] = React.useState('');
	const [status, setStatus] = React.useState('');
	const [oldStatus, setOldStatus] = React.useState('');
	const [inventory, setInventory] = React.useState('');
	const [imageUrl, setImageUrl] = React.useState('');
	const inputFileRef = React.useRef(null);

	const isEditing = Boolean(id);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			formData.append('image', event.target.files[0]);
			const { data } = await axios.post('/upload', formData);
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
			alert('Error!')
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	function checkFields(fields) {
		let msg = ``;
		let failed = false;
		console.log(fields)
		if (Object.keys(fields).length == 2) {
			if (fields.worker.length < 5) {
				msg = 'Поле рабочий должно иметь больше 5 символов!'
				failed = true;
				alert(msg)
				return false;
			}
		} else {
			if (fields.title.length < 5) {
				msg = 'Поле проблема должно иметь больше 5 символов!'
				failed = true;
			}
			if (fields.text.length < 5) {
				msg = msg + '\nПоле текст должно иметь больше 5 символов!'
				failed = true;
			}
			if (failed) {
				alert(msg)
				return false;
			}
		}
		return true;
	}

	const onSubmit = async () => {
		try {
			setLoading(true);

			let fields;

			if (isEditing) {
				fields = {
					worker,
					status,
				}
			} else {
				fields = {
					title,
					inventory,
					imageUrl,
					text
				}
			}

			if (checkFields(fields)) {
				const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);

				const _id = isEditing ? id : data._id;

				navigate(`/`);
			}

		} catch (error) {
			console.warn(error);
			alert('Произошла ошибка при публикации! Пожалуйста попробуйте заново!');
		}
	}

	React.useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({ data }) => {
				setWorker(data.worker);
				setStatus(data.status);
				setOldStatus(data.status);
			}).catch(err => {
				console.warn(err);
			})
		}
	}, [])

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Начните печатать...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[],
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	function changeStatus(e) {
		setStatus(e.value);
	}

	return (
		<Paper style={{ padding: 30 }}>
			{!isEditing ? (
				<>
					<Button className='topbtns' onClick={() => inputFileRef.current.click()} variant="outlined">
						Приложить фотографию
					</Button>
					<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
					{imageUrl && (
						<>
							<Button variant="contained" color="error" onClick={onClickRemoveImage}>
								Удалить
							</Button>
							<img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
						</>
					)}
					<br />
					<br />
					<TextField
						classes={{ root: styles.title }}
						variant="standard"
						placeholder="Проблема..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						fullWidth
					/>
					<TextField
						classes={{ root: styles.title }}
						variant="standard"
						placeholder="Инвентарный номер..."
						value={inventory}
						onChange={(e) => setInventory(e.target.value)}
						fullWidth
					/>
					<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
				</>
			) : (
				<>
					<p classes={{ root: styles.p }}>Измените рабочего:</p>
					<TextField
						classes={{ root: styles.title }}
						variant="standard"
						placeholder="не назначен."
						value={worker}
						onChange={(e) => setWorker(e.target.value)}
						fullWidth
					/>
					<p classes={{ root: styles.p }}>Измените статус:</p>
					{oldStatus == 0 && (<Select defaultValue={{ label: "В ожидании", value: 0 }} onChange={changeStatus} options={[
						{ value: 0, label: 'В ожидании' },
						{ value: 1, label: 'В работе' },
						{ value: 3, label: 'Отклонена' },
					]} />)}
					{oldStatus == 1 && (<Select defaultValue={{ value: 1, label: 'В работе' }} onChange={changeStatus} options={[
						{ value: 1, label: 'В работе' },
						{ value: 2, label: 'Выполнена' },
					]} />)}
					<br />
				</>)}


			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href="/">
					<Button size="large">Отменить</Button>
				</a>
			</div>
		</Paper>
	);
};
