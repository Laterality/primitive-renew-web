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

import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { Theme, withStyles, WithStyles } from "@material-ui/core";

import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";

import { ObjectFactory } from "../lib/object-factory";

import { ISessionVerifiable, verifySession } from "../lib/session-verfying.interface";

import { MyButton as Button } from "../component/button.component";
import { default as Header } from "../component/header.component";
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

interface IBoardPageState {
	title: BoardTitle;
	page: number;
	pageMax: number;
	posts: PostObject[];
	menuItems: ISideMenuItem[];
	mobileDrawerOpened: boolean;
}

const drawerWidth = 320;
const styles = (theme: Theme) => ({
	appBar: {
		position: "absolute" as "absolute",
		marginLeft: drawerWidth,
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerWidth}px)`,
		},
	},
	boardContent: {
		width: "80%",
		paddingLeft: "15%",
		paddingRight: "15%",
		paddingTop: "48px",
		paddingBottom: "48px",
		marginLeft: "auto",
		marginRight: "auto",
	},
	boardTitle: {
		paddingLeft: "16px",
		marginLeft: "25%",
		marginTop: "24px",
		marginBottom: "24px",
		borderLeftStyle: "solid" as "solid",
		borderLeftColor: "#0097A7",
		borderLeftWidth: "4px",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
	},
	drawerPaper: {
		width: drawerWidth,
		[theme.breakpoints.up("md")]: {
			position: "relative" as "relative",
		},
	},
	link: { 
		textDecoration: "none",
		float: "right" as "right",
		marginRight: "10%",
		marginTop: "16px", 
		marginBottom: "16px",
	},
	navIconHide: {
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	paginatorWrapper: {
		width: "100%",
		display: "flex",
		flexDirection: "row" as "row",
		justifyContent: "center",
	},
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: "hidden",
		position: "relative" as "relative",
		display: "flex",
		width: "100%",
	},
	toolbar: theme.mixins.toolbar,
});

type BoardPageProps = IBoardPageProps & WithStyles<"appBar" | "boardContent" | "boardTitle" | "content" | "drawerPaper" | "link" | "navIconHide" | "paginatorWrapper" | "root" | "toolbar">;

class BoardPage extends React.Component<BoardPageProps, IBoardPageState> {

	private readonly POSTS_PER_PAGE = 5;

	public constructor(props: BoardPageProps) {
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
			mobileDrawerOpened: false,
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
		const drawer = <div>
				<div className={this.props.classes.toolbar}/>
				<Divider />
				{this.state.menuItems.map((item: ISideMenuItem, idx: number) => {
					return <ListItem button key={idx} onClick={() => { this.update(item.name, 1); }}>
						<ListItemText primary={item.name}/>
					</ListItem>;
				})}
				<Divider />
				{this.props.user && this.props.user.getRole() === "관리자" && 
				<ListItem button>
					<ListItemText primary="관리" 
					onClick={() => { this.onAdmin(); }}/>
				</ListItem>}
				<ListItem button>
					<ListItemText primary="마이페이지" 
					onClick={() => { this.onMyPage(); }}/>
				</ListItem>
				<ListItem button>
					<ListItemText primary="로그아웃"
					onClick={() => { this.onLogout(); }}/>
				</ListItem>
				<Divider/>
			</div>;
		return (
			<div className={this.props.classes.root}>
				<Header user={this.props.user} 
				onMenu={this.onMenuClicked}
				classes={{appBar: this.props.classes.appBar,
				menuIcon: this.props.classes.navIconHide}}/>
				<Hidden mdUp>
					<Drawer
						variant="temporary"
						open={this.state.mobileDrawerOpened}
						onClose={this.onMenuClose}
						classes={{paper: this.props.classes.drawerPaper}}
						ModalProps={{
							keepMounted: true,
						}}>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden smDown>
					<Drawer
						variant="permanent"
						open
						classes={{paper: this.props.classes.drawerPaper}}>
						{drawer}
					</Drawer>
				</Hidden>
				<main className={this.props.classes.content}>
					<div className={this.props.classes.toolbar}/>
					<Typography variant="headline" className={this.props.classes.boardTitle}>{this.state.title}</Typography>
					<Paper elevation={2}
					className={this.props.classes.boardContent}>
						<PostList posts={this.state.posts} onItemClick={this.onPostClick}/>
					</Paper>
					<ReactRouter.Link 
					className={this.props.classes.link}
					to="/write">
						<Button text="글쓰기" iconSrc="/img/ic_create_white_48px.svg"/>
					</ReactRouter.Link>
					<div className={this.props.classes.paginatorWrapper}>
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
				</main>
			</div>
		);
	}

	private onMenuClicked = () => {
		this.setState({mobileDrawerOpened: true});
	}

	private onMenuClose = () => {
		this.setState({mobileDrawerOpened: false});
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})<IBoardPageProps>(BoardPage));
