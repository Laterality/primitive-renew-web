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

import Paper from "@material-ui/core/Paper";

import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";

import { ObjectFactory } from "../lib/object-factory";

import { ISessionVerifiable, verifySession } from "../lib/session-verfying.interface";

import { MyButton as Button } from "../component/button.component";
import { Header } from "../component/header.component";
import { BoardPaginator } from "../component/paginator.component";
import { PostList } from "../component/post-list.component";
import { ISideMenuItem, SideMenu } from "../component/side-menu.component";

import { NavigationActionCreator } from "../action/navigation.action";
import { UserActionCreator } from "../action/user.action";

import { IStore } from "../store";

export interface IBoardPageProps extends ISessionVerifiable {
	history: any;
	location: any;
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

		const initialState: IBoardPageState = {
			title,
			page: parseInt(page, 10),
			pageMax: 1,
			posts: [],
			menuItems: [],
		};

		for (const t in BoardTitle) {
			initialState.menuItems.push({
				name: BoardTitle[t],
				linkTo: `/board?title=${BoardTitle[t]}&page=1`,
			});
		}

		this.state = initialState;
	}

	public componentDidMount() {
		verifySession(this.props, (signed: boolean) => {
			if (!signed) {
				alert("로그인이 필요합니다.");
				this.props.history["push"]("/");
			}
			else {
				this.update(this.state.title, this.state.page);
			}
		});
	}

	public render() {
		return (
			<div>
				<Header user={this.props.user} 
				onLogoClick={this.onLogoClicked}
				onLogout={this.onLogout}
				onMyPage={this.onMyPage}
				onAdmin={this.onAdmin}/>
				<SideMenu items={this.state.menuItems} onItemClick={(item: ISideMenuItem) => {this.update(item.name, 1); }} />
				<h1 style={{
					paddingLeft: "16px",
					marginLeft: "25%",
					marginTop: "24px",
					marginBottom: "24px",
					borderLeftStyle: "solid",
					borderLeftColor: "#0097A7",
					borderLeftWidth: "4px",
				}}>{this.state.title}</h1>
				<Paper elevation={2}
				style={{
					width: "80%",
					paddingLeft: "15%",
					paddingRight: "15%",
					paddingTop: "48px",
					paddingBottom: "48px",
					marginLeft: "auto",
					marginRight: "auto",
				}}>
					<PostList posts={this.state.posts} onItemClick={this.onPostClick}/>
				</Paper>
				<ReactRouter.Link 
				style={{ textDecoration: "none",
					float: "right",
					marginRight: "10%",
					marginTop: "16px", 
					marginBottom: "16px"}} to="/write">
					<Button text="글쓰기" iconSrc="/img/ic_create_white_48px.svg"/>
				</ReactRouter.Link>
				<div style={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}>
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
			</div>
		);
	}

	private onLogoClicked = () => {
		this.props.history["push"]("/board");
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

	private onMyPage = () => {
		this.props.history["push"]("/mypage");
	}

	private onAdmin = () => {
		this.props.history["push"]("/admin");
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
