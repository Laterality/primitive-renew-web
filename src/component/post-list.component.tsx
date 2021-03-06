import * as axios from "axios";
import * as React from "react";

import { ObjectFactory } from "../lib/object-factory";

import * as reqPost from "../lib/post.request";

import { PostObject } from "../lib/post.obj";

import { default as PostListItem } from "./post-list-item.component";

export interface IPostListProps {
	posts: PostObject[];
	onItemClick?: (id: string | number) => void;
}

export class PostList extends React.Component<IPostListProps> {

	public render() {
		return (
			<ul className="list-group list-group-flush" style={{width: "100%"}}>
				{ this.props.posts.map((obj: PostObject, i: number) => 
					<PostListItem key={obj.getId()} post={obj} onClick={() => { if (this.props.onItemClick){ this.props.onItemClick(obj.getId()); }}}>{obj.getTitle()}</PostListItem>) }
			</ul>
		);
	}
}
