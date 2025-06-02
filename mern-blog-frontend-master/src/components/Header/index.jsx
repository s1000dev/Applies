import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';

import { fetchPosts } from '../../redux/slices/posts'

export const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(state => state.auth.data);
	const { posts } = useSelector(state => state.posts);

	React.useEffect(() => {
		dispatch(fetchPosts('all'));
	}, []);

	const onClickLogout = () => {
		if (window.confirm('Вы действительно хотите выйти?')) {
			dispatch(logout());
			window.localStorage.removeItem('token');
		}
	};

	const [value, setValue] = React.useState(0);

	function logoClick() {
		let tags = document.querySelectorAll('.tags a');
		for (let tag of tags) {
			tag.style.outline = 'none';
		}
		navigate("/");
		setValue(0);
		dispatch(fetchPosts('all'));
	}

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<a className={styles.logo} onClick={logoClick}>LITE<span>B</span>OX</a>
					<div className={styles.buttons}>
						{((userData?.role == 1 || userData?.role == 2) && posts.items?.length >= 1) && (
							<Button className={styles.btn} onClick={window.print} type="submit" variant="contained">
								Распечатать заявки
							</Button>
						)}
						{userData?.role == 2 && (
							<Link to="/access">
								<Button className={styles.btn} variant="contained">Изменить доступ пользователей</Button>
							</Link>
						)}
						{isAuth ? (
							<>
								{userData?.role == 0 && (
									<><Link to="/add-post">
										<Button className={styles.btn} variant="contained">Отправить заявку</Button>
									</Link><Link to="/add-post-apply">
											<Button className={styles.btn} variant="contained">Обратиться за услугами</Button>
										</Link></>
								)}
								<Button className={styles.exit} onClick={onClickLogout} variant="contained" color="error">
									Выйти
								</Button>
							</>
						) : (
							<>
								<Link to="/login">
									<Button className={styles.btn} variant="outlined">Войти</Button>
								</Link>
								<Link to="/register">
									<Button className={styles.btn} variant="contained">Зарегистрироваться</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
