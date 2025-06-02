import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

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

	function resetToNew() {
		dispatch(fetchPosts('all'));
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
				<div classname='full'>
					<div>
						<p className='full_title'>Фулфилмент-партнер для успешных селлеров</p>
						<p className='full_sub'>Работаем с 2020 года!
							Открыли фулфилмент,
							когда это не было мейнстримом.
						</p>
						<Button className='full_btn'>Обратиться к нам</Button>
					</div>
					<div>
						<img src="http://localhost:4444/uploads/about-img.png" alt="no" />
					</div>
				</div>
				<p>2.385.920 товаров упаковали за 2024 год</p>
				<p>Столько то заявок обработала наша компания.</p>
				<div>
					<p>Котельник Угрешский проезд, 8</p>
					<p>Пн - Сб 10:00 - 20:00</p>
					<p>+7 (964) 634-12-21</p>
				</div>
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
									<Tab label="Маркетные" />
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
