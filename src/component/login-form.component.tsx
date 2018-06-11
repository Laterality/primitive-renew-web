/**
 * Login form component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-20
 */
import * as axios from "axios";
import * as jquery from "jquery";
import * as PropTypes from "prop-types";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactRouter from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import * as reqUser from "../lib/user.request";

import { UserObject } from "../lib/user.obj";

export interface ILoginFormProps {
	history: any;
	onLoginButtonClick: (id: string, pw: string) => Promise<boolean>;
}

export interface ILoginFormState {
	error: boolean;
	helperText: string;
}

export class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
	private static readonly HELPERTEXT_LOGIN_ERROR = "아이디 또는 비밀번호가 일치하지 않습니다";
	private static readonly HLEPERTEXT_SERVER_FAULT = "로그인 에러, 관리자에게 문의하세요";

	public constructor(props: ILoginFormProps) {
		super(props);

		this.state = {
			error: false,
			helperText: "",
		};
	}

	public render() {
		return (
			<div className="container">
				<div className="row">
					<form className="col" >
						<div className="form-group">
							<TextField id="username" type="text" label="아이디" 
							fullWidth={true} onKeyUp={this.onKeyUp}
							error={this.state.error} />
						</div>
						<div className="form-group">
							<TextField id="password" type="password" 
							label="비밀번호" fullWidth={true} 
							onKeyUp={this.onKeyUp}
							error={this.state.error} 
							helperText={this.state.helperText}/>
						</div>
					</form>
					<Button variant="raised" color="primary" 
					className="btn text-white col-2 my-5 mx-3 px-2 py-4" 
					onClick={this.onLoginClicked}>LOGIN</Button>
				</div>
			</div>
		);
	}

	public onKeyUp = (e: any) => {
		if (e.keyCode === 13) {
			this.onLoginClicked();
		}
	}

	public onLoginClicked = async () => {
		const id = jquery("#username").val();
		const pw = jquery("#password").val();
		
		try {
			const succeed = await this.props.onLoginButtonClick(id as string, pw as string);
			if (!succeed) {
				// show helper text with error state
				this.setState({error: true, 
					helperText: LoginForm.HELPERTEXT_LOGIN_ERROR});
			}
			else {
				this.setState({error: false, helperText: ""});
			}
		}
		catch (e) {
			this.setState({error: true, helperText: 
				LoginForm.HLEPERTEXT_SERVER_FAULT});
		}
	}
}
