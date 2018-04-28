import * as React from "react";
import * as Router from "react-router-dom";

import { BoardPage } from "./page/board.page";
import { HomePage } from "./page/home.page";
import { WritePostPage } from "./page/write-post.page";

import { Routes } from "./routes";

export class App extends React.Component {

	public render() {
		return (
			<div className="router-wrapper">
				<Router.Route exact path={Routes.routeRoot} component={HomePage} />
				<Router.Route path={Routes.routeBoard} component={BoardPage} />
				<Router.Route path={Routes.routeWrite} component={WritePostPage} />
			</div>
		);
	}
}
