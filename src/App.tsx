import { AxiosResponse } from "axios";
import * as React from "react";
import { connect, Provider } from "react-redux";
import * as Router from "react-router-dom";
import { Dispatch } from "redux";

import { default as AdminPage } from "./page/admin.page";
import { default as BoardPage } from "./page/board.page";
import { default as HomePage } from "./page/home.page";
import { default as MyPage } from "./page/my-page.page";
import { default as PostPage } from "./page/post.page";
import { default as WritePostPage } from "./page/write-post.page";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { Routes } from "./routes";

import { UserActionCreator } from "./action/user.action";

import { UserAPIRequest } from "./lib/user.request";

import { ObjectFactory } from "./lib/object-factory";
import { UserObject } from "./lib/user.obj";

import { store } from "./store/index";

export class App extends React.Component {

	public componentWillReceiveProps() {
		UserAPIRequest.checkSignedIn()
		.then((res: AxiosResponse) => {
			const body = res.data;
			if (body["state"]["signed"]) {
				store.dispatch(UserActionCreator.setUser(ObjectFactory.createUserObject(body["state"]["user"])));
			}
			else { store.dispatch(UserActionCreator.setUser(undefined)); }
		});
	}

	public render() {
		const theme = createMuiTheme({
			palette: {
				primary: {
					main: "#0097A7",
				},
			},
		});
		return (
			<MuiThemeProvider theme={theme}>
				<Provider store={store}>
					<Router.BrowserRouter>
						<div className="router-wrapper">
							<Router.Route exact path={Routes.routeRoot} component={HomePage} />
							<Router.Route path={Routes.routeBoard} component={BoardPage} />
							<Router.Route path={Routes.routeWrite} component={WritePostPage} />
							<Router.Route path={Routes.routePost} component={PostPage} />
							<Router.Route path={Routes.routeMyPage} component={MyPage} />
							<Router.Route path={Routes.routeAdmin} component={AdminPage} />
						</div>
					</Router.BrowserRouter>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
