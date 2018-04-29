import * as React from "react";

import { PostObject } from "../lib/post.obj";

export interface IPostListItemProps {
	post: PostObject;
	onClick: (id: string | number) => void;
}

export class PostListItem extends React.Component<IPostListItemProps> {
	public render() {
		return(<li className="list-group-item"
			onClick={() => this.props.onClick(this.props.post.getId())}>
			{this.props.post.getTitle()}
		</li>);
	}
}
