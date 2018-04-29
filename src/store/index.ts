/**
 * Redux store
 * 
 * author: Jinwoo Shin
 * date: 2018-04-28
 */
import * as redux from "redux";
import * as reduxThunk from "redux-thunk";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";
import { reduce } from "../reducer";

export interface IStore {
	user: UserObject | undefined;
	posts: {[k in BoardTitle]: PostObject[]};
}

export const store = redux.createStore(reduce,
	redux.applyMiddleware(reduxThunk.default),
);
