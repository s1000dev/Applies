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
import styles from './AddPostApply.module.scss';
import { keyframes } from '@emotion/react';

export const AddPostApply = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(state => state.auth.data);

	const [isLoading, setLoading] = React.useState(false);
	const [text, setText] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [status, setStatus] = React.useState('');
	const [oldStatus, setOldStatus] = React.useState('');
	const [phone, setPhone] = React.useState('');

	const isEditing = Boolean(id);

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	function checkFields(fields) {
		let msg = ``;
		let failed = false;
		console.log(fields)
		if (Object.keys(fields).length == 1) {

		} else {
			if (fields.title.length < 5) {
				msg = 'Поле проблема должно иметь больше 5 символов!'
				failed = true;
			}
			if (fields.phone.length < 10) {
				msg = msg + '\nПоле телефон должно иметь больше 9 символов!'
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
					status,
				}
			} else {
				fields = {
					title,
					phone,
					text
				}
			}

			console.log(fields, status)

			if (checkFields(fields)) {
				const { data } = isEditing ? await axios.patch(`/apps/${id}`, fields) : await axios.post('/apps', fields);

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
			axios.get(`/apps/${id}`).then(({ data }) => {
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
			placeholder: 'Ваши пожелания...',
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
					<TextField
						classes={{ root: styles.title }}
						variant="standard"
						placeholder="Услуга обращения..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						fullWidth
					/>
					<TextField
						classes={{ root: styles.title }}
						variant="standard"
						placeholder="Ваш номер телефона..."
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						fullWidth
					/>
					<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
				</>
			) : (
				<>
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
					{isEditing ? 'Сохранить' : 'Отправить'}
				</Button>
				<a href="/">
					<Button size="large">Отменить</Button>
				</a>
			</div>
		</Paper>
	);
};
