/**
 * /board page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-16
 */
import * as PropTypes from "prop-types";
import * as query from "query-string";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

import * as axios from "axios";

import * as propTypes from "prop-types";
import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { onComponentReady } from "../lib/component-ready";

export interface IBoardPageProps {
	title: string;
	page: number;
	history: any;
	location: any;
}

export interface IBoardPageState {
	title: string;
	page: number;
	posts: any[];
}

export class BoardPage extends React.Component<IBoardPageProps, IBoardPageState> {

	public constructor(props: any) {
		super(props);
		this.state = {
			page: 1,
			title: "세미나",
			posts: [],
		};
	}

	public componentDidMount() {
		onComponentReady();

		const queries = query.parse(location.search);
		// console.log("title: " + queries["title"]);
		// console.log("page: " + queries["page"]);

		// if (!this.props.page) { this.setState({page: 1}); }
		// else { this.setState({page: this.props.page}); }
		// if (!this.props.title) { this.setState({title: "세미나"}); }
		// else { this.setState({title: this.props.title}); }
		console.log("p: ", this.state.page, ", t: ", this.state.title);
		reqPost.PostAPIRequest.retrievePostList(this.state.page, 
			new Date().getFullYear(), this.state.title)
		.then((res: axios.AxiosResponse) => {
			if (res.status === 200) {
				const body = res.data;
				this.setState({posts: body["posts"]});
			}
			else {
				alert("게시물 목록을 가져오는 데 실패했습니다.");
				this.setState({posts: []});
			}
		})
		.catch((err) => {
			console.log(err);
		});

		this.checkLogin();
		this.forceUpdate();
	}

	public render() {
		return (
			<div>
				<nav className="navbar"></nav>
				<h1 className="board-title"></h1>
				<ReactRouter.Link to="/" >Home</ReactRouter.Link>
				<ReactRouter.Link to="/write">
				<button className="btn">글쓰기</button>
				</ReactRouter.Link>
				<button className="btn" onClick={this.onLogout}>logout</button>
				<ul className="list-group">
					{ this.state.posts.map((obj: any, i: number) => 
					<li className="list-group-item">{obj["post_title"]}</li>) }
				</ul>
			</div>
		);
	}

	private checkLogin = () => {
		reqUser.UserAPIRequest.checkSignedIn()
		.then(async (res: axios.AxiosResponse) => {
			const body = res.data;
			if (!body["state"]["signed"]) {
				console.log(body);
				alert("로그인이 필요합니다.");
				this.props.history["push"]("/");
			}
		});
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
}
