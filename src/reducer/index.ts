/**
 * Index reducer
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import { AnyAction } from "redux";

import { IStore } from "../store";

import { BoardTitle } from "../lib/post.obj";

import { postReducer } from "./post";
import { userReducer } from "./user";

import { PostActionType } from "../action/post.action";
import { UserActionType } from "../action/user.action";

const initialState: IStore = {
	user: undefined,
	posts: {
		[BoardTitle.seminar]: [],
		[BoardTitle.works]: [],
		[BoardTitle.jrBoard]: [],
	},
};

export const reduce = (state = initialState, action: AnyAction): IStore => {
	if (action.type in UserActionType) {
		return userReducer(state, action);
	}
	else if (action.type in PostActionType) {
		return postReducer(state, action);
	}
	else { return state; }
};
