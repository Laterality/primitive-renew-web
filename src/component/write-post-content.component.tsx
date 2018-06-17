/**
 * /write page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-18
 */
import * as axios from "axios";
import * as jquery from "jquery";
import * as query from "query-string";
import * as React from "react";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { withStyles, WithStyles } from "@material-ui/core";

import { default as FileAPIRequest } from "../lib/file.req";

import * as reqPost from "../lib/post.request";

import { BoardTitle, PostObject } from "../lib/post.obj";

import { ObjectFactory } from "../lib/object-factory";

import { default as AttachButton } from "./button-attach.component";
import { MyButton as Button } from "./button.component";

import { Routes } from "../routes";

export interface IWritePostProps {
	location: any;
	history: any;
	boardFrom: BoardTitle;
}

interface IWritePostState {
	currentFile: File | null;
<<<<<<< HEAD
	mod: boolean;
	modPostId: string;
	modPostTitle: string;
	modPostContent: string;
=======
	titleError: boolean;
	contentError: boolean;
	titleHelperText: string;
	contentHelperText: string;
>>>>>>> 681d17d2eaa1a263eb0493400ba4b3c26bd7d817
}

const styles = {
	boardTitle: {
		paddingLeft: "16px",
		marginLeft: "25%",
		marginTop: "24px",
		marginBottom: "24px",
		borderLeftStyle: "solid" as "solid",
		borderLeftColor: "#0097A7",
		borderLeftWidth: "4px",
	},
	buttonWriteWrapper: {
		float: "right" as "right",
		marginRight: "10%",
		marginTop: "16px", 
		marginBottom: "16px",
	},
	contentPaper: {},
};

type WritePostProps = IWritePostProps & WithStyles<"boardTitle" | "buttonWriteWrapper" | "contentPaper">;

class WritePostContent extends React.Component<WritePostProps, IWritePostState> {

	private static readonly HELPERTEXT_INPUT_TITLE = "제목을 입력해주세요";
	private static readonly HLEPERTEXT_INPUT_CONTENT = "내용을 입력해주세요";

	public constructor(props: WritePostProps) {
		super(props);

		const queries = query.parse(location.search);
		const mod = queries["mod"];
		const id = queries["id"];

		this.state = {
			currentFile: null,
<<<<<<< HEAD
			mod: mod === "true",
			modPostId: id,
			modPostTitle: "",
			modPostContent: "",
=======
			titleError: false,
			contentError: false,
			titleHelperText: "",
			contentHelperText: "",
>>>>>>> 681d17d2eaa1a263eb0493400ba4b3c26bd7d817
		};
		console.log("mod: " + this.state.mod);
	}

	public componentDidMount() {
		if (this.state.mod) {
			reqPost.PostAPIRequest.retrievePostById(this.state.modPostId)
			.then((res: axios.AxiosResponse) => {
				if (res.status === 200) {
					const post = ObjectFactory.createPostObject(res.data["post"]);
					this.setState({
						modPostTitle: post.getTitle(),
						modPostContent: post.getContent(),
					});
				}
			});
		}
	}

	public render() {
		const { classes } = this.props;
		let filename = "";
		if (this.state.currentFile) {
			filename = this.state.currentFile.name;
		}
		return (
			<div>
				<Typography variant="headline" className={classes.boardTitle}>{this.props.boardFrom}</Typography>
				<Paper elevation={2}
					className={classes.contentPaper}>
					{/* 제목 필드 */}
					<div className="form-group">
						<TextField fullWidth id="title" type="text" label="제목" 
						placeholder="제목을 입력하세요"
						margin="normal"
<<<<<<< HEAD
						value={this.state.modPostTitle}/>
=======
						error={this.state.titleError}
						helperText={this.state.titleHelperText}/>
>>>>>>> 681d17d2eaa1a263eb0493400ba4b3c26bd7d817
					</div>

					{/* 내용 필드 */}
					<div className="form-group">
						<TextField multiline fullWidth
						id="content" label="내용"
						placeholder="게시물 내용" 
						margin="normal"
<<<<<<< HEAD
						value={this.state.modPostContent}/>
=======
						error={this.state.contentError}
						helperText={this.state.contentHelperText}/>
>>>>>>> 681d17d2eaa1a263eb0493400ba4b3c26bd7d817
					</div>

					{/* 파일 첨부 영역 */}
					<div>
						<AttachButton onChange={this.onFileChanged}/>
						<Typography>{filename}</Typography>
					</div>
				</Paper>
				<div className={classes.buttonWriteWrapper}>
					<Button 
					onClick={() => this.onWriteClicked()}
					text="완료"
					iconSrc="/img/ic_create_white_48px.svg"/>
				</div>
			</div>
		);
	}

	private onWriteClicked = () => {
		const title = jquery("#title").val() as string;
		const content = jquery("#content").val() as string;
		const boardTitle = this.props.boardFrom;
		const files: string[] = [];

		let hasError = false;

		// Validation input value
		if (title.length === 0) {
			this.setState({titleError: true, titleHelperText: WritePostContent.HELPERTEXT_INPUT_TITLE});
			hasError = true;
		}
		else {
			this.setState({titleError: false, titleHelperText: ""});
		}

		if (content.length === 0) {
			this.setState({contentError: true, contentHelperText: WritePostContent.HLEPERTEXT_INPUT_CONTENT});
			hasError = true;
		}
		else {
			this.setState({contentError: false, contentHelperText: ""});
		}
		
		if (hasError) { return; }

		if (this.state.currentFile) {
			FileAPIRequest.upload(this.state.currentFile)
			.then((res: axios.AxiosResponse) => {
				if (res.status === 200) {
					files.push(String(ObjectFactory.createFileObject(res.data["file"]).getId()));

					if (this.state.mod) {
						reqPost.PostAPIRequest.updatePost(this.state.modPostId,
						this.state.modPostTitle, this.state.modPostContent,
						files)
						.then((res2: axios.AxiosResponse) => {
							if (res2.status === 200) {
								alert("수정되었습니다.");
								this.props.history["push"](Routes.routeBoardContent);
							}
						});
					}
					reqPost.PostAPIRequest.createPost(title as string, 
						content as string, boardTitle, files)
					.then((res2: axios.AxiosResponse) => {
						const body = res2.data;
						if (body["result"] === "ok") {
							alert("등록되었습니다.");
							this.props.history["push"](Routes.routeBoardContent);
						}
						else {
							alert("등록에 실패하였습니다.");
						}
					});
				}
				else {
					alert("파일 업로드에 실패했습니다");
				}
			});
		}
		else {
			reqPost.PostAPIRequest.createPost(title as string, 
				content as string, boardTitle, files)
			.then((res: axios.AxiosResponse) => {
				const body = res.data;
				if (body["result"] === "ok") {
					alert("등록되었습니다.");
					this.props.history["push"](Routes.routeBoardContent);
				}
				else {
					alert("등록에 실패하였습니다.");
				}
			});
		}
	}

	private onFileChanged = (files: FileList | null) => {
		if (files) {
			const file = files.item(0);
			this.setState({currentFile: file});
		}
	}
}

export default withStyles(styles)<IWritePostProps>(WritePostContent);
