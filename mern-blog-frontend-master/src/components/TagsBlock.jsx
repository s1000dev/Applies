import React from "react";
import { useDispatch } from 'react-redux';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { fetchPosts } from '../redux/slices/posts';

import { SideBlock } from "./SideBlock";

const newPosts = 'new';
const zeroO = '0';
const pars = [newPosts, zeroO];
// const dispatchf = useDispatch();

function doThis() {
	// dispatchf(fetchPosts(pars));
}

export const TagsBlock = ({ items, isLoading = true }) => {
	return (
		<SideBlock title="Tags">
			<List>
				{(isLoading ? [...Array(5)] : items).map((name, i) => (
					<a onClick={doThis}
						style={{ textDecoration: "none", color: "black" }}
					>
						<ListItem key={i} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<TagIcon />
								</ListItemIcon>
								{isLoading ? (
									<Skeleton width={100} />
								) : (
									<ListItemText primary={name} />
								)}
							</ListItemButton>
						</ListItem>
					</a>
				))}
			</List>
		</SideBlock>
	);
};
