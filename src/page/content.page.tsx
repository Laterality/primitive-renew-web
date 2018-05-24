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

import {default as BoardContent, IBoardContentProps } from "../component/board-content.component";

import { default as AdminContent } from "../component/admin-content.component";
import { default as MyPageContent } from "../component/my-page-content.component";
import { default as PostContent } from "../component/post-content.component";
import { default as WritePostContent } from "../component/write-post-content.component";

import { NavigationActionCreator } from "../action/navigation.action";
import { UserActionCreator } from "../action/user.action";

import { ICurrentNavigation, IStore } from "../store";

import { Routes } from "../routes";

export interface IContentProps extends ISessionVerifiable {
	history: any;
	location: any;
	navInfor: ICurrentNavigation;
	onBoardLoaded: (title: BoardTitle, page: number) => void;
	onPostNavigated: (post: PostObject) => void;
}

interface IContentState {
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
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		marginTop: theme.mixins.toolbar.height,
		marginLeft: drawerWidth,
		[theme.breakpoints.down("md")]: {
			marginLeft: "auto",
			marginRight: "auto",
		},
	},
	contentPaperNarrow: {
		width: "80%",
		paddingLeft: "15%",
		paddingRight: "15%",
		paddingTop: "48px",
		paddingBottom: "48px",
		marginLeft: "auto",
		marginRight: "auto",
	},
	contentPaperNormal: {
		width: "80%",
		paddingLeft: "10%",
		paddingRight: "10%",
		paddingTop: "48px",
		paddingBottom: "48px",
		marginLeft: "auto",
		marginRight: "auto",
	},
	contentTitle: {
		paddingLeft: "16px",
		marginLeft: "25%",
		marginTop: "24px",
		marginBottom: "24px",
		borderLeftStyle: "solid" as "solid",
		borderLeftColor: "#0097A7",
		borderLeftWidth: "4px",
	},
	drawerPaper: {
		width: drawerWidth,
		[theme.breakpoints.up("md")]: {
			position: "fixed" as "fixed",
		},
	},
	navIconHide: {
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
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

type BoardContentProps = IContentProps & WithStyles<"appBar" | "content" | "contentPaperNarrow" | "contentPaperNormal" | "contentTitle" | "drawerPaper" | "navIconHide" | "root" | "toolbar">;

class BoardPage extends React.Component<BoardContentProps, IContentState> {

	private readonly POSTS_PER_PAGE = 5;

	private boardUpdater: ((title: BoardTitle, page: number) => void) | undefined;

	public constructor(props: BoardContentProps) {
		super(props);

		const initialState: IContentState = {
			menuItems: [],
			mobileDrawerOpened: false,
		};

		for (const t in BoardTitle) {
			initialState.menuItems.push({
				name: BoardTitle[t],
				linkTo: `${Routes.routeBoardContent}?title=${BoardTitle[t]}&page=1`,
			});
		}

		this.state = initialState;
		this.boardUpdater = undefined;
	}

	public componentDidMount() {
		verifySession(this.props, (signed: boolean) => {
			if (!signed) {
				alert("로그인이 필요합니다.");
				this.props.history["push"]("/");
			}
		});
	}

	public render() {
		const { classes } = this.props;
		const drawer = <div>
				<div className={this.props.classes.toolbar}/>
				<Divider />
				{this.state.menuItems.map((item: ISideMenuItem, idx: number) => {
					return <ListItem button key={idx} onClick={() => { this.onBoardItemClicked(item.name); }}>
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
			<div className={classes.root}>
				<Header user={this.props.user} 
				onMenu={this.onMenuClicked}
				classes={{appBar: classes.appBar,
				menuIcon: classes.navIconHide}}/>
				<Hidden mdUp>
					<Drawer
						variant="temporary"
						open={this.state.mobileDrawerOpened}
						onClose={this.onMenuClose}
						classes={{paper: classes.drawerPaper}}
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
						classes={{paper: classes.drawerPaper}}>
						{drawer}
					</Drawer>
				</Hidden>
				<main className={classes.content}>
					<div className={classes.toolbar}/>
					{/* render content component */}
					<ReactRouter.Switch>
						<ReactRouter.Route path={Routes.routeBoardContent} 
							render={() => <BoardContent 
								classes={{
									boardContent: classes.contentPaperNarrow,
									boardTitle: classes.contentTitle}}
								location={this.props.location}
								history={this.props.history}
								postPerPage={this.POSTS_PER_PAGE}
								onBoardLoaded={this.props.onBoardLoaded}
								onSetUpdater={(updater: (title: BoardTitle, page: number) => void) => { this.boardUpdater = updater; }}/>} />
						<ReactRouter.Route path={Routes.routeWriteContent}
							render={() => <WritePostContent 
								classes={{contentPaper: classes.contentPaperNormal}}
								history={this.props.history}
								boardFrom={this.props.navInfor.boardTitle}/>} />
						<ReactRouter.Route path={Routes.routePostContent}
							render={() => <PostContent
								classes={{
									contentPaper: classes.contentPaperNormal,
									boardTitle: classes.contentTitle}}
								location={this.props.location}
								boardTitleFrom={this.props.navInfor.boardTitle}
								pageNumFrom={this.props.navInfor.page}
								onPostNavigated={this.props.onPostNavigated}
								user={this.props.user}/>} />
						<ReactRouter.Route path={Routes.routeMyPageContent} 
							render={() => <MyPageContent
								classes={{
									title: classes.contentTitle,
									paper: classes.contentPaperNarrow,
								}}
								location={this.props.location}
								history={this.props.history}
								user={this.props.user} />} />
						<ReactRouter.Route path={Routes.routeAdminContent} component={AdminContent} />
					</ReactRouter.Switch>
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

	private onBoardItemClicked = (title: string) => {
		this.props.history["push"](`${Routes.routeBoardContent}?title=${title}&page=1`);
		if (this.boardUpdater) {
			try {
				this.boardUpdater(title as BoardTitle, 1);
			}
			catch (e) { 
				// throw away exception
				const err = e;
			}
		}
	}

	private onMyPage = () => {
		this.props.history["push"](Routes.routeMyPageContent);
	}

	private onAdmin = () => {
		this.props.history["push"](Routes.routeAdminContent);
	}

}

const mapStateToProps = (state: IStore) => {
	return {
		user: state.user,
		navInfor: state.current,
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
		onPostNavigated: (post: PostObject) => {
			dispatch(NavigationActionCreator.setPost(post));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})<IContentProps>(BoardPage));
