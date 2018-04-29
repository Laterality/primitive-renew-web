/**
 * Frontend Index
 * 
 * author: Jin-woo Shin
 * date: 2018-04-13
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as Router from "react-router-dom";

import { App } from "./App";
import { store } from "./store/index";

ReactDOM.render(
	<Provider store={store}>
		<Router.BrowserRouter>
			<App/>
		</Router.BrowserRouter>
	</Provider>,
	document.getElementById("root"),
);
