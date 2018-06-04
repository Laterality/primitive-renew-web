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

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { withStyles, WithStyles } from "@material-ui/core";

import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";

import { UserActionCreator } from "../action/user.action";

import { MyButton as Button } from "../component/button.component";
import { ObjectFactory } from "../lib/object-factory";
import { IStore } from "../store";

import { Routes } from "../routes";

export interface IWritePostProps {
	history: any;
	boardFrom: BoardTitle;
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

class WritePostContent extends React.Component<WritePostProps> {

	public render() {
		const { classes } = this.props;
		return (
			<div>
				<Typography variant="headline" className={classes.boardTitle}>{this.props.boardFrom}</Typography>
				<Paper elevation={2}
					className={classes.contentPaper}>
					<div className="form-group">
						<TextField fullWidth id="title" type="text" label="제목" 
						placeholder="제목을 입력하세요"
						margin="normal"/>
					</div>
					<div className="form-group">
						<TextField multiline fullWidth
						id="content" label="내용"
						placeholder="게시물 내용" 
						margin="normal"/>
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
		reqPost.PostAPIRequest.createPost(title as string, content as string,
			boardTitle, files)
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

export default withStyles(styles)<IWritePostProps>(WritePostContent);
