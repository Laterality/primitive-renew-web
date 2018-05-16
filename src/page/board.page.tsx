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

import { ISessionVerifiable } from "../lib/session-verfying.interface";

import { MyButton as Button } from "../component/button.component";
import { BoardPaginator } from "../component/paginator.component";
import { PostList } from "../component/post-list.component";
import { ISideMenuItem, SideMenu } from "../component/side-menu.component";

import { NavigationActionCreator } from "../action/navigation.action";
import { UserActionCreator } from "../action/user.action";

import { IStore } from "../store";

export interface IBoardPageProps extends ISessionVerifiable {
	history: any;
	location: any;
	user: UserObject | undefined;
	onBoardLoaded: (title: BoardTitle, page: number) => void;
}

export interface IBoardPageState {
	title: BoardTitle;
	page: number;
	pageMax: number;
	posts: PostObject[];
	menuItems: ISideMenuItem[];
}

class BoardPage extends React.Component<IBoardPageProps, IBoardPageState> {

	private readonly POSTS_PER_PAGE = 5;

	public constructor(props: IBoardPageProps) {
		super(props);

		const queries = query.parse(location.search);
		const title = queries["title"] ? queries["title"] : BoardTitle.seminar;
		const page: string = queries["page"] ? queries["page"] : "1";

		this.state = {
			title,
			page: parseInt(page, 10),
			pageMax: 1,
			posts: [],
			menuItems: [],
		};

		for (const t in BoardTitle) {
			this.state.menuItems.push({
				name: BoardTitle[t],
				linkTo: `/board?title=${BoardTitle[t]}&page=1`,
			});
		}
	}

	public componentDidMount() {

		if (!this.props.user) {
			reqUser.UserAPIRequest.checkSignedIn()
			.then((res: axios.AxiosResponse) => {
				const body = res.data;
				if (body["state"]["signed"]) {
					this.props.onSessionVerified(ObjectFactory.createUserObject(body["state"]["user"]));
				}
				else {
					alert("로그인이 필요합니다.");
					this.props.history["push"]("/");
				}
			});
		}

		this.update(this.state.title, this.state.page);
	}

	public render() {
		return (
			<div>
				<nav className="navbar"></nav>
				<SideMenu items={this.state.menuItems} onItemClick={(item: ISideMenuItem) => {this.update(item.name, 1); }} />
				<h1 className="board-title">{this.state.title}</h1>
				<PostList posts={this.state.posts} onItemClick={this.onPostClick}/>
				<ReactRouter.Link style={{ textDecoration: "none" }} to="/write">
				<Button text="글쓰기" iconSrc="/img/ic_create_white_48px.svg"/>
				</ReactRouter.Link>
				<ReactRouter.Link style={{ textDecoration: "none" }} to="/mypage">
					<Button text="마이페이지" />
				</ReactRouter.Link>
				<ReactRouter.Link style={{ textDecoration: "none" }} to="/admin">
					<Button text="관리" />
				</ReactRouter.Link>
				<button className="btn" onClick={this.onLogout}>logout</button>
				<BoardPaginator 
					pageMin={ 1 }
					pageMax={this.state.pageMax}
					pageCurrent={this.state.page}
					pagePlusMinus={ 2 }
					onPageClick={(page: number) => {this.update(this.state.title, page); }}
					onNextClick={(currnet: number, max: number) => { 
						this.update(this.state.title, max + 1); }}
					onPreviousClick={(current: number, min: number) => {
						this.update(this.state.title, min - 1);
					}}/>
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
		// 
	}

	private update = (title: string, page: number) => {
		let matchedTitle: string | undefined;
		for (const t in BoardTitle) {
			if (title === BoardTitle[t]) { matchedTitle = BoardTitle[t]; break; }
		}

		if (!matchedTitle) { title = BoardTitle.seminar; }
		
		this.setState({title: title as BoardTitle, page}, () => {
			reqPost.PostAPIRequest.retrievePostList(this.state.page, 
				new Date().getFullYear(), this.state.title)
			.then((res: axios.AxiosResponse) => {
				if (res.status === 200) {
					const body = res.data;
					const posts: PostObject[] = [];
	
					for (const p of body["posts"]["posts"]) {
						posts.push(ObjectFactory.createPostObject(p));
					}
					const totalPosts = body["posts"]["total"];
					let pages = totalPosts / this.POSTS_PER_PAGE;
					if (totalPosts % this.POSTS_PER_PAGE !== 0) {
						pages++;
					}
					this.setState({posts, pageMax: Math.floor(pages)});
					this.props.onBoardLoaded(this.state.title, this.state.page);
					// this.forceUpdate();
				}
				else {
					alert("게시물 목록을 가져오는 데 실패했습니다.");
				}
			})
			.catch((err) => {
				console.log(err);
			});
		});
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
		onBoardLoaded: (title: BoardTitle, page: number) => {
			dispatch(NavigationActionCreator.setBoardTitle(title));
			dispatch(NavigationActionCreator.setPageNum(page));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
