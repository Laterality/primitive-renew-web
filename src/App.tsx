import { AxiosResponse } from "axios";
import * as React from "react";
import { connect, Provider } from "react-redux";
import * as Router from "react-router-dom";
import { Dispatch } from "redux";

import { default as ContentPage } from "./page/content.page";
import { default as HomePage } from "./page/home.page";

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
							<Router.Route path={"/content"} component={ContentPage}/>
						</div>
					</Router.BrowserRouter>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
