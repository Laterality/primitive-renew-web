/**
 * /post page
 * 
 * author: Jinwoo Shin
 * dat: 2018-04-18
 */
import { AxiosResponse } from "axios";
import * as query from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { PostAPIRequest } from "../lib/post.request";

import { BoardTitle, PostObject } from "../lib/post.obj";

import { onComponentReady } from "../lib/component-ready";
import { ObjectFactory } from "../lib/object-factory";
import { IStore } from "../store";

export interface IPostPageProps {
	location: any;
	boardTitleFrom: BoardTitle;
	pageNumFrom: number;
}

export interface IPostPageState {
	post: PostObject | undefined;
}

class PostPage extends React.Component<IPostPageProps, IPostPageState> {

	public constructor(props: any) {
		super(props);
		this.state = {
			post: undefined,
		};
	}

	public componentDidMount() {
		onComponentReady();

		const queries = query.parse(location.search);
		const id = queries["id"];

		PostAPIRequest.retrievePostById(id)
		.then((res: AxiosResponse) => {
			if (res.status >= 400) {
				alert("Error occurred while load post");
			}
			else {
				this.setState({post: ObjectFactory.createPostObject(res.data["post"])});
			}
		});
	}

	public render() {
		return (
			<div>
				<h1>{this.state.post ? this.state.post.getTitle() : ""}</h1> 
				<p>{this.state.post ? this.state.post.getContent() : ""}</p>
				<Link to={`/write?mod=true&id=`}><h5>수정</h5></Link>
				<h5>삭제</h5>
				<Link to={`/board?title=${this.props.boardTitleFrom}&page=${this.props.pageNumFrom}`} >
					<h5>≪ 목록으로</h5>
				</Link>
			</div>
		);
	}
}

const mapStateToProps = (state: IStore) => {
	return {
		boardTitleFrom: state.current.boardTitle,
		pageNumFrom: state.current.page,
	};
};

export default connect(mapStateToProps, null)(PostPage);
