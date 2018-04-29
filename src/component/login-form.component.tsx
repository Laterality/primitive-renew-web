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

import * as reqUser from "../lib/user.request";

import { UserObject } from "../lib/user.obj";

export interface ILoginFormProps {
	history: any;
	onLoginButtonClick: (id: string, pw: string) => void;
}

export class LoginForm extends React.Component<ILoginFormProps> {

	public render() {
		return (
			<div className="container">
			<div className="row">
				<form className="col" >
					<div className="form-group">
						<label htmlFor="username">ID</label>
						<input id="username" type="text" className="form-control" placeholder="학번" aria-label="Username" onKeyUp={this.onKeyUp}/>
					</div>
					<div className="form-group">
						<label htmlFor="password">PW</label>
						<input id="password" type="password" className="form-control" placeholder="Password" aria-label="Password" onKeyUp={this.onKeyUp}/>
					</div>
				</form>
				<button type="submit" className="btn text-white bg-primary col-2 my-5 mx-3 px-2" onClick={this.onLoginClicked}>LOGIN</button>
				</div>
			</div>
		);
	}

	public onKeyUp = (e: any) => {
		if (e.keyCode === 13) {
			this.onLoginClicked();
		}
	}

	public onLoginClicked = () => {
		const id = jquery("#username").val();
		const pw = jquery("#password").val();
		
		this.props.onLoginButtonClick(id as string, pw as string);
	}
}
