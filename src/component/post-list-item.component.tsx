/**
 * Post list item component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import * as React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { PostObject } from "../lib/post.obj";

export interface IPostListItemProps {
	post: PostObject;
	onClick: (id: string | number) => void;
}

export class PostListItem extends React.Component<IPostListItemProps> {
	public render() {
		return(<li className="list-group-item" 
			style={{
				paddingTop: "16px",
				paddingBottom: "16px",
			}}
			onClick={() => this.props.onClick(this.props.post.getId())}>
			<Link to={`/post?id=${this.props.post.getId()}`} >
				<Typography variant="title">{this.props.post.getTitle()}</Typography>
			</Link>
			<Typography variant="body2" color="textSecondary" 
			style={{
				marginTop: "4px",
				marginBottom: "4px",
			}}>{this.props.post.getContent()}</Typography>
			<Typography variant="caption" color="textSecondary"
			>{this.props.post.getDateCreated() ? this.props.post.getDateCreated() : ""}</Typography>
		</li>);
	}
}
