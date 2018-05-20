/**
 * / page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-20
 */
import * as axios from "axios";
import * as React from "react";
import { connect } from "react-redux";
import * as Redux from "redux";

import Paper from "@material-ui/core/Paper";

import { ISessionVerifiable, verifySession } from "../lib/session-verfying.interface";

import { LoginForm } from "../component/login-form.component";

import { ObjectFactory } from "../lib/object-factory";

import { UserAPIRequest } from "../lib/user.request";

import { UserObject } from "../lib/user.obj";

import { UserActionCreator } from "../action/user.action";

import { IStore } from "../store";

export interface IHomePageProps extends ISessionVerifiable {
	history: any;
	onLoginSucceed: (user: UserObject) => void;
}

class HomePage extends React.Component<IHomePageProps> {

	public componentDidMount() {
		verifySession(this.props, (signed: boolean) => {
			if (signed) {
				alert("이미 로그인되어있습니다.");
				this.props.history["push"]("/board");
			}
		});
	}

	public render() {
		return (
			<div className="d-flex flex-column justify-content-center"
				style={{
					height: "100%",
				}}>
				<img src="img/primitive_logo.svg" alt="logo" className="mx-auto mb-5" style={{width: "20rem"}}/>
				<Paper elevation={3} className="mx-auto mt-5 px-4 py-3 pt-5" style={{width: "32rem"}}>
					<LoginForm history={this.props.history}
					onLoginButtonClick={this.onLoginButtonClick}/>
				</Paper>
			</div>
		);
	}

	private onLoginButtonClick = (id: string, pw: string) => {
		UserAPIRequest.loginUser(id as string, pw as string)
		.then(async (res: axios.AxiosResponse) => {
			const body = res.data;
			if (body["result"] === "ok") {
				// 로그인 성공
				this.props.onLoginSucceed(ObjectFactory.createUserObject(body["user"]));
				this.props.history["push"]("/board");
			}
			else {
				if (res.status === 403) {
					alert("로그인 정보 불일치");
				}
				else if (res.status === 500) {
					alert("서버 이상, 관리자에게 문의 바랍니다.");
				}
			}
		});
	}
}

const mapStateToProps = (state: IStore) => {
	return {
		user: state.user,
	};
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
	return {
		onLoginSucceed: (user: UserObject) => {
			dispatch(UserActionCreator.setUser(user));
		},
		onSessionVerified: (user: UserObject) => {
			dispatch(UserActionCreator.setUser(user));
		},
	};
};

export default connect(null, mapDispatchToProps)(HomePage);
