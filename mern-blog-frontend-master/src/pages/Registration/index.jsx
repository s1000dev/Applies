import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();

	const { register, handleSubmit, setError,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	function fillMsg(value, message, fail) {
		message = message + value;
		message = message + '\n';
		fail = true;
		return [message, fail];
	}

	function checkPassword(pass) {
		let msg = ``;
		let failed = false;
		if (pass.length < 6) {
			[msg, failed] = fillMsg('Пароль должен состоять из минимум 6 символов!', msg, failed);
		}
		if (!(/[A-ZА-Я]/.test(pass))) {
			[msg, failed] = fillMsg('Пароль должен содержать прописную букву!', msg, failed);
		}
		if (!(/\d/.test(pass))) {
			[msg, failed] = fillMsg('Пароль должен содержать цифру!', msg, failed);
		}
		if (!(/[!%#$%^]/.test(pass))) {
			[msg, failed] = fillMsg('Пароль должен содержать спец. символ (! % # $ % ^)!', msg, failed);
		}
		if (failed) {
			alert(msg);
			return false;
		}
		return true;
	}

	const onSubmit = async (values) => {
		if (checkPassword(values.password)) {
			const data = await dispatch(fetchRegister(values));

			if (!data.payload) {
				alert('Ошибка в регистрации, попробуйте снова!');
			} else {
				alert('Вы успешно зарегистрировались!');
			}

			if ('token' in data.payload) {
				window.localStorage.setItem('token', data.payload.token);
			}
		}
	}

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Создать аккаунт
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Заполните имя' })} className={styles.field} label="Имя" fullWidth />
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type="email"
					{...register('email', { required: 'Заполните E-mail' })} className={styles.field} label="E-Mail" fullWidth />
				<TextField
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					type="password"
					{...register('password', { required: 'Заполните пароль' })} className={styles.field} label="Пароль" fullWidth />
				<Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
