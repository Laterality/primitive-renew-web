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
import { Dispatch } from "redux";

import { PostAPIRequest } from "../lib/post.request";
import { ReplyAPIRequest } from "../lib/reply.request";

import { NavigationActionCreator } from "../action/navigation.action";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { ReplyObject } from "../lib/reply.obj";

import { ObjectFactory } from "../lib/object-factory";
import { IStore } from "../store";

import { ReplyInput } from "../component/reply-input.component";
import { ReplyList } from "../component/reply-list.component";

import { Routes } from "../routes";

export interface IPostContentProps {
	location: any;
	boardTitleFrom: BoardTitle;
	pageNumFrom: number;
	onPostNavigated: (post: PostObject) => void;
}

interface IPostContentState {
	post: PostObject;
}

class PostContent extends React.Component<IPostContentProps, IPostContentState> {

	public constructor(props: any) {
		super(props);

		this.state = {
			post: new PostObject("", "", ""),
		};
	}

	public componentDidMount() {
		this.update();
	}

	public render() {
		const replyList = this.state.post ? 
		(<ReplyList replies={this.state.post.getReplies()}/>) : undefined;
		return (
			<div>
				<h1>{this.state.post ? this.state.post.getTitle() : ""}</h1> 
				<p>{this.state.post ? this.state.post.getContent() : ""}</p>
				<Link to={`${Routes.routeWriteContent}?mod=true&id=${this.state.post.getId()}`}><h5>수정</h5></Link>
				<h5>삭제</h5>
				<Link to={`${Routes.routeBoardContent}?title=${this.props.boardTitleFrom}&page=${this.props.pageNumFrom}`} >
					<h5>≪ 목록으로</h5>
				</Link>
				<ReplyInput 
					onInputClick={this.writeReply}
				/>
				{replyList}
			</div>
		);
	}

	private update = () => {
		const queries = query.parse(location.search);
		const id = queries["id"];

		PostAPIRequest.retrievePostById(id)
		.then((res: AxiosResponse) => {
			if (res.status >= 400) {
				alert("Error occurred while load post");
			}
			else {
				const post = ObjectFactory.createPostObject(res.data["post"]);
				this.props.onPostNavigated(post);
				this.setState({post});
			}
		});
	}

	private writeReply = (input: string) => {
		if (!this.state.post) { return; }
		ReplyAPIRequest.createReply(this.state.post.getId().toString(), input)
		.then((res: AxiosResponse) => {
			const body = res.data;
			this.update();
		});
	}
}

const mapStateToProps = (state: IStore) => {
	return {
		boardTitleFrom: state.current.boardTitle,
		pageNumFrom: state.current.page,
		post: state.current.post,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		onPostNavigated: (post: PostObject) => {
			dispatch(NavigationActionCreator.setPost(post));
		},
	};
};

export default PostContent;
