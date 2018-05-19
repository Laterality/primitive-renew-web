/**
 * My-page page component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-15
 */
import * as axios from "axios";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

import { MyButton as Button } from "../component/button.component";

import { UserActionCreator } from "../action/user.action";

import { ISessionVerifiable, verifySession } from "../lib/session-verfying.interface";
import { IStore } from "../store";

import { ObjectFactory } from "../lib/object-factory";

import { UserObject } from "../lib/user.obj";

import { UserAPIRequest } from "../lib/user.request";

export interface IMyPageProps extends ISessionVerifiable {
	history: any;
	location: any;
}

class MyPage extends React.Component<IMyPageProps> {

	public componentDidMount() {

		verifySession(this.props, (signed: boolean) => {
			if (!signed) {
				alert("로그인이 필요합니다.");
				this.props.history["push"]("/");
			}
		});
	}

	public render() {
		return (
		<div>
			<form>
				<FormControl className="form-group d-block" disabled fullWidth={true}>
					<InputLabel htmlFor="username" >아이디</InputLabel>
					<Input id="username" type="text" value={this.props.user ? this.props.user.getSid() : ""} className="text-dark" fullWidth={true}/>
				</FormControl>
				<FormControl className="form-group d-block" disabled fullWidth={true}>
					<InputLabel htmlFor="name" >이름</InputLabel>
					<Input id="name" type="text" value={this.props.user ? this.props.user.getName() : ""} className="text-dark" fullWidth={true}/>
				</FormControl>
				<FormControl className="form-group d-block" disabled fullWidth={true}>
					<InputLabel htmlFor="role" >등급</InputLabel>
					<Input id="role" type="text" value={this.props.user ? this.props.user.getRole() : ""} className="text-dark" fullWidth={true} />
				</FormControl>
				<TextField id="password-current" type="password" label="현재 비밀번호" fullWidth={true}/>
				<TextField id="password-new" type="password" label="새 비밀번호" fullWidth={true}/>
				<TextField id="password-new-confirm" type="password" label="새 비밀번호 확인" fullWidth={true}/>
				<Button text="완료" iconSrc="/img/ic_create_white_48px.svg"/>
			</form>
		</div>);
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
