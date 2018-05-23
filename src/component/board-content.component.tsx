/**
 * Board content component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-22
 */
import { AxiosResponse } from "axios";
import * as query from "query-string";
import * as React from "react";
import { Link } from "react-router-dom";

import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import { Theme, withStyles, WithStyles } from "@material-ui/core";

import { MyButton as Button } from "./button.component";
import { BoardPaginator } from "./paginator.component";
import { PostList } from "./post-list.component";

import { ObjectFactory } from "../lib/object-factory";

import { BoardTitle, PostObject } from "../lib/post.obj";

import { PostAPIRequest } from "../lib/post.request";
import { Routes } from "../routes";

const styles = (theme: Theme) => ({
	boardContent: {},
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
	yearSelector: {
		float: "right" as "right",
		marginBottom: "16px",
	},
});

export interface IBoardContentProps {
	location: any;
	history: any;
	postPerPage: number;
	onBoardLoaded: (title: BoardTitle, page: number) => void;
	onSetUpdater?: (updater: (title: BoardTitle, page: number) => void) => void;
}

interface IBoardContentState {
	pageMax: number;
	posts: PostObject[];
	page: number;
	title: BoardTitle;
	year: number;
}

type BoardContentProps = IBoardContentProps & WithStyles<"boardTitle" | "boardContent" | "link" | "paginatorWrapper" | "yearSelector">;

class BoardContent extends React.Component<BoardContentProps, IBoardContentState> {

	public constructor(props: BoardContentProps) {
		super(props);

		const queries = query.parse(location.search);
		const title = queries["title"] ? queries["title"] : BoardTitle.seminar;
		const page: string = queries["page"] ? queries["page"] : "1";

		this.state = {
			pageMax: 0,
			posts: [],
			page: parseInt(page, 10),
			title,
			year: new Date().getFullYear(),
		};
		if (this.props.onSetUpdater) {
			this.props.onSetUpdater(this.update);
		}
	}

	public componentDidMount() {
		this.update(this.state.title, this.state.page);
	}
	
	public render() {
		const years: number[] = [];
		for (let i = this.state.year; i >= 2018; i--) {
			years.push(i);
		}
		const yearSelectMenus = years.map((yr: number) => {
			return (<MenuItem key={yr} value={yr}>{yr}</MenuItem>);
		});
		return (
			<div>
				<Typography variant="headline" className={this.props.classes.boardTitle}>{this.state.title}</Typography>
				<Paper elevation={2}
				className={this.props.classes.boardContent}>
					<div>
						<Select
							className={this.props.classes.yearSelector}
							value={this.state.year}>
							{yearSelectMenus}
						</Select>
					</div>
					<PostList posts={this.state.posts}/>
				</Paper>
				<Link 
				className={this.props.classes.link}
				to={Routes.routeWriteContent}>
					<Button text="글쓰기" iconSrc="/img/ic_create_white_48px.svg"/>
				</Link>
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
			</div>
		);
	}

	private update = (title: BoardTitle, page: number) => {
		let matchedTitle: string | undefined;
		for (const t in BoardTitle) {
			if (title === BoardTitle[t]) { matchedTitle = BoardTitle[t]; break; }
		}

		if (!matchedTitle) { title = BoardTitle.seminar; }
		
		this.setState({title, page}, () => {
			PostAPIRequest.retrievePostList(this.state.page, 
				this.state.year, this.state.title)
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
					this.props.onBoardLoaded(this.state.title, this.state.page);
				}
				else {
					alert("게시물 목록을 가져오는 데 실패했습니다.");
				}
			});
		});
	}

	private onYearChange = (event: any) => {
		const old = this.state.year;
		this.setState({year: event["target"]["value"]}, () => {
			if (old !== this.state.year) {
				this.update(this.state.title, this.state.page);
			}
		});
	}
}

export default withStyles(styles, {withTheme: true})<IBoardContentProps>(BoardContent);
