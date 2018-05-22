/**
 * Board content component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-22
 */
import { AxiosResponse } from "axios";
import * as React from "react";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { Theme, withStyles, WithStyles } from "@material-ui/core";

import { MyButton as Button } from "./button.component";
import { BoardPaginator } from "./paginator.component";
import { PostList } from "./post-list.component";

import { ObjectFactory } from "../lib/object-factory";

import { BoardTitle, PostObject } from "../lib/post.obj";

import { PostAPIRequest } from "../lib/post.request";

const styles = (theme: Theme) => ({
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
	link: { 
		textDecoration: "none",
		float: "right" as "right",
		marginRight: "10%",
		marginTop: "16px", 
		marginBottom: "16px",
	},
	paginatorWrapper: {
		width: "100%",
		display: "flex",
		flexDirection: "row" as "row",
		justifyContent: "center",
	},
});

export interface IBoardContentProps {
	location: any;
	history: any;
	title: BoardTitle;
	page: number;
	postPerPage: number;
	onBoardLoaded: (title: BoardTitle, page: number) => void;
}

interface IBoardContentState {
	pageMax: number;
	posts: PostObject[];
	page: number;
}

type BoardContentProps = IBoardContentProps & WithStyles<"boardTitle" | "boardContent" | "link" | "paginatorWrapper">;

class BoardContent extends React.Component<BoardContentProps, IBoardContentState> {

	public constructor(props: BoardContentProps) {
		super(props);

		this.state = {
			pageMax: 0,
			posts: [],
			page: props.page,
		};
	}

	public componentDidMount() {
		this.update(this.props.title, this.props.page);
	}
	
	public render() {
		return (
			<div>
				<Typography variant="headline" className={this.props.classes.boardTitle}>{this.props.title}</Typography>
				<Paper elevation={2}
				className={this.props.classes.boardContent}>
					<PostList posts={this.state.posts}/>
				</Paper>
				<Link 
				className={this.props.classes.link}
				to="/write">
					<Button text="글쓰기" iconSrc="/img/ic_create_white_48px.svg"/>
				</Link>
				<div className={this.props.classes.paginatorWrapper}>
					<BoardPaginator 
							pageMin={ 1 }
							pageMax={this.state.pageMax}
							pageCurrent={this.props.page}
							pagePlusMinus={ 2 }
							onPageClick={(page: number) => {this.update(this.props.title, page); }}
							onNextClick={(currnet: number, max: number) => { 
								this.update(this.props.title, max + 1); }}
							onPreviousClick={(current: number, min: number) => {
								this.update(this.props.title, min - 1);
					}}/>
				</div>
			</div>
		);
	}

	private update = (title: string, page: number) => {
		let matchedTitle: string | undefined;
		for (const t in BoardTitle) {
			if (title === BoardTitle[t]) { matchedTitle = BoardTitle[t]; break; }
		}

		if (!matchedTitle) { title = BoardTitle.seminar; }
		
		this.setState({page}, () => {
			PostAPIRequest.retrievePostList(this.state.page, 
				new Date().getFullYear(), this.props.title)
			.then((res: AxiosResponse) => {
				if (res.status === 200) {
					const body = res.data;
					const posts: PostObject[] = [];
	
					for (const p of body["posts"]["posts"]) {
						posts.push(ObjectFactory.createPostObject(p));
					}
					const totalPosts = body["posts"]["total"];
					let pages = totalPosts / this.props.postPerPage;
					if (totalPosts % this.props.postPerPage !== 0) {
						pages++;
					}
					this.setState({posts, pageMax: Math.floor(pages)});
					this.props.onBoardLoaded(this.props.title, this.state.page);
				}
				else {
					alert("게시물 목록을 가져오는 데 실패했습니다.");
				}
			});
		});
	}
}

export default withStyles(styles, {withTheme: true})<IBoardContentProps>(BoardContent);
