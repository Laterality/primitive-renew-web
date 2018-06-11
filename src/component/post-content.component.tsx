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

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { withStyles, WithStyles } from "@material-ui/core";

import { PostAPIRequest } from "../lib/post.request";
import { ReplyAPIRequest } from "../lib/reply.request";

import { checkPermission, formatDate } from "../lib/utils";

import { NavigationActionCreator } from "../action/navigation.action";

import { FileObject } from "../lib/file.obj";
import { BoardTitle, PostObject } from "../lib/post.obj";
import { ReplyObject } from "../lib/reply.obj";
import { UserObject } from "../lib/user.obj";

import { ObjectFactory } from "../lib/object-factory";
import { IStore } from "../store";

import { default as ReplyInput } from "../component/reply-input.component";
import { ReplyList } from "../component/reply-list.component";

import { Routes } from "../routes";

import { config } from "../config";

export interface IPostContentProps {
	location: any;
	history: any;
	user: UserObject;
	boardTitleFrom: BoardTitle;
	pageNumFrom: number;
	onPostNavigated: (post: PostObject) => void;
}

interface IPostContentState {
	post: PostObject;
	deletionDialogOpened: boolean;
}

const styles = {
	backToList: {
		marginTop: "16px",
		marginBottom: "16px",
	},
	boardTitle: {
	},
	postActionItem: {
		display: "inline-block",
		marginLeft: "4px",
		marginRight: "4px",
	},
	postAuthor: {
		display: "inline-block",
		paddingRight: "4px",
	},
	postDataWrapper: {
		marginBottom: "24px",
	},
	postDate: {
		display: "inline",
		marginLeft: "8px",
		paddingLeft: "8px",
		borderLeftColor: "grey",
		borderLeftStyle: "solid" as "solid",
		borderLeftWidth: "2px",
	},
	postTitle: {
		marginBottom: "16px",
	},
	contentPaper: {},
};

type PostContentProps = IPostContentProps & WithStyles<"backToList" | "boardTitle" | "contentPaper" | "postActionItem" | "postAuthor" | "postDataWrapper" | "postDate" | "postTitle">;

class PostContent extends React.Component<PostContentProps, IPostContentState> {

	public constructor(props: any) {
		super(props);

		const queries = query.parse(location.search);
		const title = queries["title"] ? queries["title"] : BoardTitle.seminar;
		const page: string = queries["page"] ? queries["page"] : "1";

		this.state = {
			post: new PostObject("", "", "", "", [], new Date(), this.props.user),
			deletionDialogOpened: false,
		};
	}

	public componentDidMount() {
		this.update();
	}

	public render() {
		const { classes } = this.props;
		const replyList = this.state.post ? 
		(<ReplyList replies={this.state.post.getReplies()}/>) : undefined;

		const author = this.state.post.getAuthor();
		const postInfo = 
			<div className={classes.postDataWrapper}> 
				{author && <Typography variant="subheading"
					className={classes.postAuthor}>
					{author.getName()} ({author.getRole()})
				</Typography>}
				<Typography variant="caption"
					className={classes.postDate}>
					{formatDate(this.state.post.getDateCreated())}
				</Typography>
			</div>;

		const filesAttached = (<div>
			{this.state.post.getFilesAttached().map((f: FileObject) => {
				return (
				<a key={f.getId()} 
					href={`${config.baseurl}/${f.getFilename()}`}>
					<Typography variant="subheading">{f.getFilename()}
					</Typography>
				</a>);
			})}
		</div>);

		// Link to Edit and Delete post
		const editPost = checkPermission(this.state.post, this.props.user) && (
			<div>
				<Link to={`${Routes.routeWriteContent}?mod=true&id=${this.state.post.getId()}`}
					className={classes.postActionItem}>
					<Typography variant="caption">수정</Typography>
				</Link>
				<a className={classes.postActionItem}
				onClick={() => this.handleDelete()}>
					<Typography variant="caption">
						삭제
					</Typography>
				</a>
			</div>
		);

		// Dialog asking confirmation for deleting post
		const postDeletionDialog = (<Dialog 
			open={this.state.deletionDialogOpened}
			onClose={() => this.handleDeletionDialogClose(false)}>
			<DialogTitle>게시물 삭제</DialogTitle>
			<DialogContent>
				<DialogContentText>
					게시물을 정말 삭제하시겠습니까?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="primary" 
				onClick={() => this.handleDeletionDialogClose(false)}>아니오</Button>
				<Button color="primary"
				onClick={() => this.handleDeletionDialogClose(true)}>예</Button>
			</DialogActions>
		</Dialog>);

		return (
			<div>
				<Typography variant="headline" className={classes.boardTitle}>{this.props.boardTitleFrom}</Typography>
				<Paper className={classes.contentPaper}>

					{/* 게시물 제목 */}
					<Typography variant="title"
						className={classes.postTitle}>
						{this.state.post ? this.state.post.getTitle() : ""}
					</Typography>
					{postInfo}
					{filesAttached}
					<Typography paragraph variant="body1">{this.state.post ? this.state.post.getContent() : ""}</Typography>
					{editPost}
					<Link to={`${Routes.routeBoardContent}?title=${this.props.boardTitleFrom}&page=${this.props.pageNumFrom}`} >
						<h5 className={classes.backToList}>≪ 목록으로</h5>
					</Link>
					<ReplyInput 
						onInputClick={this.writeReply}
					/>
					{replyList}
				</Paper>
				{postDeletionDialog}
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
				const post = ObjectFactory.createPostObject(res.data["post"]);
				this.props.onPostNavigated(post);
				this.setState({post});
			}
		});
	}

	private writeReply = (input: string) => {
		if (!this.state.post) { return; }
		ReplyAPIRequest.createReply(this.state.post.getId().toString(), input)
		.then((res: AxiosResponse) => {
			const body = res.data;
			this.update();
		});
	}

	private handleDeletionDialogClose = (accepted?: boolean) => {
		if (accepted) {
			this.deletePost();
		}

		this.setState({deletionDialogOpened: false});
	}

	private handleDelete = () => {
		this.setState({deletionDialogOpened: true});
	}

	private deletePost = async () => {
		PostAPIRequest.deletePost(this.state.post.getId())
		.then((res: AxiosResponse) => {
			if (res.status === 200) {
				alert("삭제되었습니다");
				this.props.history["push"](Routes.routeBoardContent);
			}
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

export default withStyles(styles)<IPostContentProps>(PostContent);
