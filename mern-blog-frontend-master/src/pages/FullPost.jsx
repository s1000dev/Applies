import React from "react";
import { useParams } from 'react-router-dom'
import axios from '../axios'

import { Post } from "../components/Post";

export const FullPost = () => {
	const [data, setData] = React.useState();
	const [isLoading, setLoading] = React.useState(true);
	const { id } = useParams();

	React.useEffect(() => {
		axios.get(`/posts/${id}`).then(res => {
			setData(res.data);
			setLoading(false);
		}).catch((err) => {
			console.warn(err);
			alert('Error while getting book.');
		});
	}, [])

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />;
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : 'http://localhost:4444/uploads/book.png'}
				user={data.user}
				createdAt={data.createdAt.slice(0, 10)}
				viewsCount={data.viewsCount}
				commentsCount={3}
				tags={data.tags}
				worker={data.worker}
				userRenting={data.userRenting}
				isFullPost
			>
				<p>
					{data.text}
				</p>
			</Post >
		</>
	);
};
