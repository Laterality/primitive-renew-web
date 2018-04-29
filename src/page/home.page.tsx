/**
 * / page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-20
 */
import * as axios from "axios";
import * as React from "react";

import { onComponentReady } from "../lib/component-ready";

import { LoginForm } from "../component/login-form.component";

import { UserAPIRequest } from "../lib/user.request";

export interface IHomePageProps {
	history: any;
}

export class HomePage extends React.Component<IHomePageProps> {

	public componentDidMount() {
		// 세션 검사해서 로그인여부 확인
		UserAPIRequest.checkSignedIn()
		.then(async (res: axios.AxiosResponse) => {
			const body = res.data;

			if (body["state"]["signed"] === true) {
				alert("이미 로그인되어있습니다.");
				this.props.history["push"]("/board");
			}
		});
	}

	public render() {
		return (
			<div className="home-wrapper d-flex flex-column justify-content-center">
				<img src="img/primitive_logo.svg" alt="logo" className="home-logo mx-auto mb-5"/>
				<div className="home-login-box mx-auto mt-5 px-4 py-3">
					<LoginForm history={this.props.history}
					onLoginButtonClick={this.onLoginButtonClick}/>
				</div>
			</div>
		);
	}

	private onLoginButtonClick = (id: string, pw: string) => {
		UserAPIRequest.loginUser(id as string, pw as string)
		.then(async (res: axios.AxiosResponse) => {
			const body = res.data;
			if (body["result"] === "ok") {
				// 로그인 성공
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
