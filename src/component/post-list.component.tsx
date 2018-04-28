import * as axios from "axios";
import * as React from "react";

import { ObjectFactory } from "../lib/object-factory";

import * as reqPost from "../lib/post.request";

import { PostObject } from "../lib/post.obj";

export interface IPostListProps {
	title: string;
	page: number;
}

export interface IPostListState {
	posts: PostObject[];
}

export class PostList extends React.Component<IPostListProps, IPostListState> {

	public constructor(props: any) {
		super(props);

		this.state = {
			posts: [],
		};
	}

	public componentDidMount() {

		reqPost.PostAPIRequest.retrievePostList(this.props.page, 
			new Date().getFullYear(), this.props.title)
		.then((res: axios.AxiosResponse) => {
			if (res.status === 200) {
				const body = res.data;
				const posts: PostObject[] = [];

				for (const p of body["posts"]) {
					posts.push(ObjectFactory.createPostObject(p));
				}
				this.setState({posts});
			}
			else {
				alert("게시물 목록을 가져오는 데 실패했습니다.");
				this.setState({posts: []});
			}
		})
		.catch((err) => {
			console.log(err);
		});
	}

	public render() {
		return (
			<ul className="list-group">
				{ this.state.posts.map((obj: PostObject, i: number) => 
					<li className="list-group-item">{obj.getTitle()}</li>) }
			</ul>
		);
	}
}
