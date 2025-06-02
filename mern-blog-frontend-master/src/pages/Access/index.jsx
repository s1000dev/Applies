import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from '../../axios'

import styles from "./Access.module.scss";

export const Access = () => {
	const userData = useSelector(state => state.auth.data);

	let email;

	if (userData?.role !== 2) {
		return <Navigate to='/' />;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const { data } = await axios.get(`/role/${email}`);
		if (data.role === 0) {
			alert('Вы успешно установили права модератора у пользователя ' + email);
		} else if (data.role === 1) {
			alert('Вы успешно сняли права модератора с пользователя ' + email);
		} else {
			alert('Произошла ошибка! Проверьте введенную почту.');
		}
		let inputEmail = document.querySelector('.MuiOutlinedInput-input');
		inputEmail.value = email;
	}

	function changeEmail(e) {
		email = e.target.value;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Измените роль пользователя по его E-mail
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					className={styles.field}
					label="E-Mail пользователя"
					type="email"
					fullWidth
					onChange={changeEmail}
				/>
				<Button type="submit" size="large" variant="contained" fullWidth>
					Изменить права модератора
				</Button>
			</form>
		</Paper>
	);
};
