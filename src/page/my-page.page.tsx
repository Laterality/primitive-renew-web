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

import { UserActionCreator } from "../action/user.action";

import { ISessionVerifiable } from "../lib/session-verfying.interface";
import { IStore } from "../store";

import { ObjectFactory } from "../lib/object-factory";

import { UserObject } from "../lib/user.obj";

import { UserAPIRequest } from "../lib/user.request";

export interface IMyPageProps extends ISessionVerifiable {
	history: any;
	location: any;
	user: UserObject | undefined;
}

class MyPage extends React.Component<IMyPageProps> {

	public componentDidMount() {

		if (!this.props.user) {
			UserAPIRequest.checkSignedIn()
			.then((res: axios.AxiosResponse) => {
				const body = res.data;
				if (body["state"]["signed"]) {
					this.props.onSessionVerified(ObjectFactory.createUserObject(body["state"]["user"]));
				}
				else {
					alert("로그인이 필요합니다.");
					this.props.history["push"]("/");
				}
			});
		}
	}

	public render() {
		return (
		<div>
			<form>
				<FormControl className="form-group d-block" disabled>
					<InputLabel htmlFor="username" >아이디</InputLabel>
					<Input id="username" type="text" value={this.props.user ? this.props.user.getSid() : ""} className="text-dark"/>
				</FormControl>
				<FormControl className="form-group d-block" disabled>
					<InputLabel htmlFor="name" >이름</InputLabel>
					<Input id="name" type="text" value={this.props.user ? this.props.user.getName() : ""} className="text-dark"/>
				</FormControl>
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
