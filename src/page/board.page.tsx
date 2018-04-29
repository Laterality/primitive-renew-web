/**
 * /board page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-16
 */
import * as axios from "axios";
import * as query from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import * as ReactRouter from "react-router-dom";
import { Dispatch } from "redux";

import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";

import { ObjectFactory } from "../lib/object-factory";

import { onComponentReady } from "../lib/component-ready";
import { ISessionVerifiable } from "../lib/session-verfying.interface";

import { Button } from "../component/button.component";
import { PostList } from "../component/post-list.component";

import { UserActionCreator } from "../action/user.action";

import { IStore } from "../store";

export interface IBoardPageProps extends ISessionVerifiable {
	history: any;
	location: any;
	user: UserObject | undefined;
}

export interface IBoardPageState {
	title: string;
	page: number;
	posts: PostObject[];
}

class BoardPage extends React.Component<IBoardPageProps, IBoardPageState> {

	public constructor(props: IBoardPageProps) {
		super(props);
		this.state = {
			title: BoardTitle.seminar,
			page: 1,
			posts: [],
		};
	}

	public componentDidMount() {
		onComponentReady();

		const queries = query.parse(location.search);
		this.setState({
			title: queries["title"] || BoardTitle.seminar,
			page: queries["page"] || 1});

		if (!this.props.user) {
			reqUser.UserAPIRequest.checkSignedIn()
			.then((res: axios.AxiosResponse) => {
				const body = res.data;
				if (body["state"]["signed"]) {
					this.props.onSessionVerified(body["state"]["user"]);
				}
				else {
					alert("로그인이 필요합니다.");
					this.props.history["push"]("/");
				}
			});
		}

		reqPost.PostAPIRequest.retrievePostList(this.state.page, 
			new Date().getFullYear(), this.state.title)
		.then((res: axios.AxiosResponse) => {
			if (res.status === 200) {
				const body = res.data;
				const posts: PostObject[] = [];

				for (const p of body["posts"]["posts"]) {
					posts.push(ObjectFactory.createPostObject(p));
				}
				this.setState({posts});
			}
			else {
				alert("게시물 목록을 가져오는 데 실패했습니다.");
			}
		})
		.catch((err) => {
			console.log(err);
		});
	}

	public render() {
		return (
			<div>
				<nav className="navbar"></nav>
				<h1 className="board-title">{this.state.title}</h1>
				<PostList posts={this.state.posts} onItemClick={this.onPostClick}/>
				<ReactRouter.Link to="/" >Home</ReactRouter.Link>
				<ReactRouter.Link to="/write">
				<Button text="글쓰기" iconSrc="/img/ic_create_white_48px.svg"/>
				</ReactRouter.Link>
				<button className="btn" onClick={this.onLogout}>logout</button>
			</div>
		);
	}

	private onLogout = () => {
		reqUser.UserAPIRequest.logoutUser()
		.then(async (res: axios.AxiosResponse) => {
			const body = res.data;
			if (body["result"] === "ok") {
				alert("로그아웃되었습니다.");
				this.props.history["push"]("/");
			}
		});
	}

	private onPostClick = (id: string | number) => {
		console.log("clicked post: ", id);
	}
}

const mapStateToProps = (state: IStore) => {
	return {
		user: state.user,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		onSessionVerified: (user: UserObject) => {
			dispatch(UserActionCreator.setUser(user));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
