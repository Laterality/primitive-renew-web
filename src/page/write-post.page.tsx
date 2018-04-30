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

import * as reqPost from "../lib/post.request";
import * as reqUser from "../lib/user.request";

import { onComponentReady } from "../lib/component-ready";
import { ISessionVerifiable } from "../lib/session-verfying.interface";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";

import { UserActionCreator } from "../action/user.action";

import { Button } from "../component/button.component";
import { ObjectFactory } from "../lib/object-factory";
import { IStore } from "../store";

export interface IWritePostProp extends ISessionVerifiable {
	history: any;
	user: UserObject;
	boardFrom: BoardTitle;
}

class WritePostPage extends React.Component<IWritePostProp> {

	public componentDidMount() {
		onComponentReady();

		if (!this.props.user) {
			reqUser.UserAPIRequest.checkSignedIn()
			.then((res: axios.AxiosResponse) => {
				const body = res.data;
				if (!body["state"]["signed"]) {
					alert("로그인이 필요합니다.");
					this.props.history["push"]("/");
				}
				else {
					this.props.onSessionVerified(ObjectFactory.createUserObject(body["state"]["user"]));
				}
			});
		}
	}

	public render() {
		return (
			<div>
				Write some post
				<div className="form-group">
					<label htmlFor="title">제목</label>
					<input type="text" id="title" className="form-control" placeholder="제목을 입력하세요." />
				</div>
				<div className="form-group">
					<label htmlFor="content">내용</label>
					<textarea id="content" className="form-control" ref="contentForm" rows={20} />
				</div>
				<span className="float-right" onClick={() => this.onWriteClicked()}>
					<Button 
					text="완료"
					iconSrc="/img/ic_create_white_48px.svg"/>
				</span>
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
				this.props.history["push"]("/board");
			}
			else {
				alert("등록에 실패하였습니다.");
			}
		});
	}
}

const mapStateToProps = (state: IStore) => {
	return {
		user: state.user,
		boardFrom: state.current.boardTitle,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		onSessionVerified: (user: UserObject) => {
			dispatch(UserActionCreator.setUser(user));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WritePostPage);
