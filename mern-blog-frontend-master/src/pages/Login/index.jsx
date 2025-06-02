import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form'

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();

	const { register, handleSubmit, setError,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values))

		if (!data.payload) {
			return alert('Ошибка при входе! Неправильный логин или пароль!');
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		} else {
		}
	}

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Войти в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type="email"
					{...register('email', { required: 'Fill in the email' })}
					fullWidth
				/>
				<TextField className={styles.field} type="password" label="Пароль" fullWidth
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Fill in the password' })}
				/>
				<Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	);
};
