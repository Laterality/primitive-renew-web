/**
 * Post list item component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import * as React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { Theme, withStyles, WithStyles } from "@material-ui/core";

import { PostObject } from "../lib/post.obj";

import { Routes } from "../routes";

export interface IPostListItemProps {
	post: PostObject;
	onClick: (id: string | number) => void;
}

const styles = (theme: Theme) => ({
	contentExcerpt: {
		marginTop: "4px",
		marginBottom: "4px",
	},
});

type PostListItemProps = IPostListItemProps & WithStyles<"contentExcerpt">;

class PostListItem extends React.Component<PostListItemProps> {
	public render() {
		return(<li className="list-group-item" 
			style={{
				paddingTop: "16px",
				paddingBottom: "16px",
				display: "inline",
			}}
			onClick={() => this.props.onClick(this.props.post.getId())}>
			<Link to={`${Routes.routePostContent}?id=${this.props.post.getId()}`} >
				<Typography variant="title">{this.props.post.getTitle()}</Typography>
			</Link>
			<Typography variant="body2" color="textSecondary" 
			className={this.props.classes.contentExcerpt}>{this.props.post.getContent()}</Typography>
			<Typography variant="caption" color="textSecondary"
			>{this.props.post.getDateCreated() ? this.props.post.getDateCreated() : ""}</Typography>
		</li>);
	}
}

export default withStyles(styles, {withTheme: true})<IPostListItemProps>(PostListItem);
