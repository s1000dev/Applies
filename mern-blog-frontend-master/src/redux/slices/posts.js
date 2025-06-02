import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ type, status }) => {
	if (typeof status !== "number") {
		throw new Error("status должен быть числом!");
	}
	const { data } = await axios.get(`/applies/${type}/${status}`);
	return data;
})

export const fetchNamePosts = createAsyncThunk('posts/fetchNamePosts', async (bookName) => {
	const { data } = await axios.get(`/book/${bookName}`);
	return data;
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
	const { data } = await axios.delete(`/posts/${id}`);
})
export const fetchRemoveApply = createAsyncThunk('posts/fetchRemoveApply', async (id) => {
	const { data } = await axios.delete(`/apps/${id}`);
})

const initialState = {
	posts: {
		items: [],
		status: 'loading',
		params: null,
	},
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPosts.pending]: (state, action) => {
			state.posts.status = 'loading';
			state.posts.params = action.meta.arg;
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		[fetchNamePosts.pending]: (state) => {
			state.posts.status = 'loading';
		},
		[fetchNamePosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchNamePosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
		},
		[fetchRemoveApply.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
		},
	},
})

export const postsReducer = postsSlice.reducer;