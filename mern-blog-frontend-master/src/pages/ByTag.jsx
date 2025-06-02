import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper";

import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts } from '../redux/slices/posts';
import { fetchTags } from '../redux/slices/posts';

export const ByTag = () => {
	const [data, setData] = React.useState();
	const [isLoading, setLoading] = React.useState(true);
	const { id } = useParams();

	React.useEffect(() => {
		axios.get(`/tag/${id}`).then(res => {
			setData(res.data);
			setLoading(false);
		}).catch((err) => {
			console.warn(err);
			alert('Error while getting tag!');
		});
	}, [])

	const userData = useSelector(state => state.auth.data);
	const { posts, tags } = useSelector(state => state.posts);

	return (
		<>
			<Grid>
				<Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
					<Tab label="New" />
					<Tab label="Old" />
					<Tab label="Popular" />
				</Tabs>
				<Grid>
					<TagsBlock items={tags.items} isLoading={isLoading} />
				</Grid>
			</Grid>
			<Grid>
				<Grid className='posts' item>
					{(isLoading ? [...Array(5)] : data).map((obj, index) =>
						isLoading ? (
							<Post key={index} isLoading={true} />
						)
							: (
								<Post
									id={obj._id}
									title={obj.title}
									imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
									user={obj.user}
									createdAt={obj.createdAt.slice(0, 10)}
									viewsCount={obj.viewsCount}
									tags={obj.tags}
									isEditable={userData?._id === obj.user}
								/>
							))}
				</Grid>
			</Grid>

		</>
	);
};
