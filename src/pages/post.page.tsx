/**
 * /post page
 * 
 * author: Jinwoo Shin
 * dat: 2018-04-18
 */
import * as React from "react";

import { onComponentReady } from "../lib/component-ready";

export class PostPage extends React.Component {

	public componentDidMount() {
		onComponentReady();
	}

	public render() {
		return (
			<div>
				<h1>Post Title</h1> 
				<p>some post contents here</p>
			</div>
		);
	}
}
