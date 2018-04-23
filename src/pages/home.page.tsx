/**
 * / page
 * 
 * author: Jinwoo Shin
 * date: 2018-04-20
 */
import * as React from "react";

import { onComponentReady } from "../lib/component-ready";

import { LoginForm } from "../components/login-form.component";

export interface IHomePageProps {
	history: any;
}

export class HomePage extends React.Component<IHomePageProps> {

	public componentDidMount() {
		console.log("component did mount");
		onComponentReady();
	}

	public componentDidUpdate() {
		console.log("component did update");
		onComponentReady();
	}

	public render() {
		return (
			<div className="home-wrapper d-flex flex-column justify-content-center">
				<img src="img/primitive_logo.svg" alt="logo" className="home-logo mx-auto mb-5"/>
				<div className="home-login-box mx-auto mt-5 px-4 py-3">
					<LoginForm history={this.props.history}/>
				</div>
			</div>
		);
	}
}
