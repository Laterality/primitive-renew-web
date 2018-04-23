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

export class BoardPage extends React.Component<IBoardPageProps> {

	private posts: any;

	public componentDidMount() {
		onComponentReady();

		this.checkLogin();
		const queries = query.parse(location.search);
		console.log("title: " + queries["title"]);
		console.log("page: " + queries["page"]);

		
	}

	public render() {
		return (
			<div>
				<nav className="navbar"></nav>
				<h1 className="board-title"></h1>
				<ReactRouter.Link to="/" >Home</ReactRouter.Link>
				<ReactRouter.Link to="/write"><button className="btn">글쓰기</button>
				</ReactRouter.Link>
				<button className="btn" onClick={this.onLogout}>logout</button>
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
