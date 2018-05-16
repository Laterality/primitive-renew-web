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

export interface IPostPageProps {
	location: any;
	boardTitleFrom: BoardTitle;
	pageNumFrom: number;
	post: PostObject | undefined;
	onPostNavigated: (post: PostObject) => void;
}

class PostPage extends React.Component<IPostPageProps> {

	public constructor(props: any) {
		super(props);
		this.state = {
			post: undefined,
		};
	}

	public componentDidMount() {
		this.update();
	}

	public render() {
		const replyList = this.props.post ? 
		(<ReplyList replies={this.props.post.getReplies()}/>) : undefined;
		return (
			<div>
				<h1>{this.props.post ? this.props.post.getTitle() : ""}</h1> 
				<p>{this.props.post ? this.props.post.getContent() : ""}</p>
				<Link to={`/write?mod=true&id=`}><h5>수정</h5></Link>
				<h5>삭제</h5>
				<Link to={`/board?title=${this.props.boardTitleFrom}&page=${this.props.pageNumFrom}`} >
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
				this.props.onPostNavigated(ObjectFactory.createPostObject(res.data["post"]));
			}
		});
	}

	private writeReply = (input: string) => {
		if (!this.props.post) { return; }
		ReplyAPIRequest.createReply(this.props.post.getId().toString(), input)
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

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
