/**
 * /write page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-18
 */
import * as axios from "axios";
import * as jquery from "jquery";
import * as propTypes from "prop-types";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import MUIButton from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { withStyles, WithStyles } from "@material-ui/core";

import { default as FileAPIRequest } from "../lib/file.req";

import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";

import { ObjectFactory } from "../lib/object-factory";

import { UserActionCreator } from "../action/user.action";

import { default as AttachButton } from "./button-attach.component";
import { MyButton as Button } from "./button.component";

import { IStore } from "../store";

import { Routes } from "../routes";

export interface IWritePostProps {
	history: any;
	boardFrom: BoardTitle;
}

interface IWritePostState {
	currentFile: File | null;
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

	public constructor(props: WritePostProps) {
		super(props);

		this.state = {
			currentFile: null,
		};
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
						margin="normal"/>
					</div>

					{/* 내용 필드 */}
					<div className="form-group">
						<TextField multiline fullWidth
						id="content" label="내용"
						placeholder="게시물 내용" 
						margin="normal"/>
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
		const title = jquery("#title").val();
		const content = jquery("#content").val();
		const boardTitle = this.props.boardFrom;
		const files: string[] = [];
		if (this.state.currentFile) {
			FileAPIRequest.upload(this.state.currentFile)
			.then((res: axios.AxiosResponse) => {
				if (res.status === 200) {
					files.push(String(ObjectFactory.createFileObject(res.data["file"]).getId()));

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
