import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, ByTag, Access, AddPostApply } from "./pages";
import React from 'react';
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	React.useEffect(() => {
		dispatch(fetchAuthMe());
	}, [])

	return (
		<>
			<Header />
			<Container maxWidth="lg">
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/posts/:id' element={<FullPost />} />
					<Route path='/tag/:id' element={<ByTag />} />
					<Route path='/access' element={<Access />} />
					<Route path='/posts/:id/edit' element={<AddPost />} />
					<Route path='/add-post' element={<AddPost />} />
					<Route path='/add-post-apply' element={<AddPostApply />} />
					<Route path='/postsapply/:id/edit' element={<AddPostApply />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Registration />} />
				</Routes>
			</Container>
		</>
	);
}

export default App;
