import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import { MenuItem, Select, FormControl, InputLabel, Typography, Box } from '@mui/material';

import { Post } from '../components/Post';
import { fetchNamePosts, fetchPosts } from '../redux/slices/posts';
import { Button } from '@mui/material';

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const { posts } = useSelector(state => state.posts);

	const isPostsLoading = posts.status === 'loading';

	// Состояния для выбранных значений
	const [tabIndex, setTabIndex] = React.useState(0);
	const [statusValue, setStatusValue] = React.useState(4);

	// Текущие значения для запроса
	const currentType = ['all', 'tech', 'market'][tabIndex];
	const currentStatus = statusValue;

	// Общий метод для отправки запроса
	const fetchData = React.useCallback(() => {
		dispatch(fetchPosts({
			type: currentType,
			status: currentStatus
		}));
	}, [currentType, currentStatus, dispatch]);

	// Обработчик изменения таба
	const handleTabChange = (event, newIndex) => {
		setTabIndex(newIndex);
	};

	// Обработчик изменения статуса
	const handleStatusChange = (event) => {
		setStatusValue(Number(event.target.value));
	};

	// Отправляем запрос при изменении параметров
	React.useEffect(() => {
		fetchData();
	}, [fetchData]);


	function calcPosts() {
		let posts = document.querySelector('.posts');

		if (posts.children.length == 0) {
			alert('Нет подходящих заявок!')
		}
	}

	const sortByBookName = () => {
		const value = getSearchInput();

		// Сбрасываем фильтры
		setTabIndex(0); // 'all'
		setStatusValue(4); // 'Все' (как у вас указано в Select)

		if (value) {
			dispatch(fetchNamePosts(value));
		} else {
			dispatch(fetchPosts({ type: 'all', status: 4 })); // Сбрасываем к начальным значениям
		}
	};

	function getSearchInput() {
		let input = document.querySelector('.search input');
		return input.value;
	}

	function createHomeContent() {
		if (userData?._id) {
			if (userData?.role == 0) {
				let userPosts = 0;
				posts.items.forEach((obj, index) => {
					if (userData?._id === obj.user?._id) {
						userPosts++;
						return;
					}
				})
				if (userPosts == 0) {
					return <p className='noapplies'>На данный момент нет заявок от вашего имени! Опубликовать заявку вы можете по одноимённой кнопке вверху экрана.</p>
				} else {
					return <Grid className='posts' item>
						{(isPostsLoading ? [...Array(6)] : posts.items).map((obj, index) =>
							isPostsLoading ? (
								<Post key={index} isLoading={true} />
							)
								: (
									userData?._id === obj.user._id && (
										< Post
											id={obj._id}
											title={obj.title}
											imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
											user={obj.user}
											createdAt={obj.createdAt.slice(0, 10)}
											inventory={obj.inventory}
											isEditable={userData?._id === obj.user._id}
											status={obj.status}
											worker={obj.worker}
											num={obj.num}
											text={obj.text}
											phone={obj.phone}
										/>)
								))}
					</Grid>
				}
			} else if (userData?.role == 1 || userData?.role == 2) {
				return <Grid className='posts' item>
					{(isPostsLoading ? [...Array(6)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						)
							: (
								< Post
									id={obj._id}
									title={obj.title}
									imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
									user={obj.user}
									createdAt={obj.createdAt.slice(0, 10)}
									inventory={obj.inventory}
									isEditable={userData?._id === obj.user._id}
									status={obj.status}
									worker={obj.worker}
									num={obj.num}
									text={obj.text}
									phone={obj.phone}
								/>
							))}
				</Grid>
			}
		} else {
			return <Grid>
				<Grid
					container
					sx={{
						minHeight: 'calc(100vh - 64px)',
						padding: 4,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#f5f5f5'
					}}
				>
					{/* Текстовый блок - всегда слева */}
					<Grid item xs={12} md={6} sx={{
						padding: 4,
						textAlign: { xs: 'center', md: 'left' }
					}}>
						<Typography
							variant="h3"
							gutterBottom
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.8rem', md: '2.4rem' }
							}}
						>
							Фулфилмент-партнер для успешных селлеров
						</Typography>

						<Typography
							variant="body1"
							paragraph
							sx={{
								mb: 3,
								color: 'text.secondary',
								fontSize: { xs: '1rem', md: '1.2rem' }
							}}
						>
							Работаем с 2020 года!<br />
							Открыли фулфилмент,<br />
							когда это не было мейнстримом.
						</Typography>

						<Link
							className='full_btn'
							to="/register"
							variant="contained"
							size="large"
							sx={{
								px: 4,
								py: 1.5,
								fontSize: '4rem'
							}}
						>
							Обратиться к нам
						</Link>
					</Grid>

					{/* Блок с изображением - всегда справа на десктопе */}
					<Grid item xs={12} md={6} sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: { xs: '50vh', md: '70vh' },
						padding: 2
					}}>
						<Box
							component="img"
							src={`http://localhost:4444/uploads/about-img.png`}
							alt="О компании"
							sx={{
								width: 'auto',
								height: '100%',
								maxWidth: '100%',
								borderRadius: 2,
								objectFit: 'contain',
								boxShadow: 3
							}}
						/>
					</Grid>
				</Grid>
				<Box
					sx={{
						minHeight: '90vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
						px: { xs: 2, md: 4 },
						py: { xs: 4, md: 8 },
						color: '#333333'
					}}
				>
					{/* Статистика */}
					<Box sx={{
						mb: { xs: 4, md: 6 },
						'& p': {
							fontSize: { xs: '1.2rem', md: '1.5rem' },
							lineHeight: 1.6,
							mb: 2
						}
					}}>
						<Typography variant="h5" component="p" sx={{
							fontWeight: 700,
							fontSize: { xs: '1.8rem', md: '2.5rem' }
						}}>
							2.385.920 товаров упаковали за 2024 год
						</Typography>
						<Typography variant="h6" component="p" sx={{
							fontSize: { xs: '1.4rem', md: '1.8rem' },
							color: 'text.secondary'
						}}>
							Количество заявок, которое обработала наша компания: {posts?.items[posts?.items.length - 1].num}
						</Typography>
					</Box>

					{/* Контактная информация */}
					<Box sx={{
						mb: { xs: 4, md: 6 },
						'& p': {
							fontSize: { xs: '1.1rem', md: '1.3rem' },
							lineHeight: 1.8,
							mb: 1
						}
					}}>
						<Typography variant="subtitle1" component="p" sx={{ fontWeight: 600 }}>
							Котельник Угрешский проезд, 8
						</Typography>
						<Typography variant="body1" component="p">
							Пн - Сб 10:00 - 20:00
						</Typography>
						<Typography variant="body1" component="p" sx={{ mt: 2 }}>
							<Button href="tel:+79646341221" color="inherit" underline="hover">
								+7 (964) 634-12-21
							</Button>
						</Typography>
					</Box>

					{/* Кнопка */}
					<Button
						component={Link}
						to="/register"
						className="full_btn"
						variant="contained"
						size="large"
						sx={{
							px: 6,
							py: 2,
							fontSize: '1.1rem',
							fontWeight: 600,
							borderRadius: '8px',
							textTransform: 'none',
							boxShadow: 3,
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: 6
							},
							transition: 'all 0.3s ease'
						}}
					>
						Оставить заявку
					</Button>
				</Box>
			</Grid >
		}
	}

	return (
		<>
			<Grid className='noprint'>
				{(userData?.role === 1 || userData?.role === 2) && (
					<Grid>
						<Grid container rowSpacing={1}>
							<Grid className='mainPosts' item>
								<Tabs
									value={tabIndex}
									onChange={handleTabChange}
									style={{ marginBottom: 15 }}
								>
									<Tab label="Все заявки" />
									<Tab label="Технические" />
									<Tab label="Целевые" />
								</Tabs>
							</Grid>
							<Grid item>
								<FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
									<InputLabel>Статус заявки</InputLabel>
									<Select
										value={statusValue}
										onChange={handleStatusChange}
										label="Статус заявки"
									>
										<MenuItem value={4}>Все</MenuItem>
										<MenuItem value={0}>Ожидают</MenuItem>
										<MenuItem value={1}>В работе</MenuItem>
										<MenuItem value={2}>Выполнены</MenuItem>
										<MenuItem value={3}>Отклонены</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item style={{ marginLeft: 'auto' }}>
								<TextField style={{ marginBottom: 25 }} className='search' type="text" label="Поиск по названию" onInput={sortByBookName}
								/>
							</Grid>
						</Grid>
					</Grid>

				)}
			</Grid >
			<Grid>
				{createHomeContent()}
			</Grid>
		</>
	);
};
