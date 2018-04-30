/**
 * Index reducer
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import { AnyAction } from "redux";

import { IStore } from "../store";

import { BoardTitle } from "../lib/post.obj";

import { navigationReducer } from "./navigation";
import { userReducer } from "./user";

import { NavigationActionType } from "../action/navigation.action";
import { UserActionType } from "../action/user.action";

const initialState: IStore = {
	user: undefined,
	current: {
		boardTitle: BoardTitle.seminar,
		page: 1,
		post: undefined,
	},
};

export const reduce = (state = initialState, action: AnyAction): IStore => {
	if (action.type in UserActionType) {
		return userReducer(state, action);
	}
	else if (action.type in NavigationActionType) {
		return navigationReducer(state, action);
	}
	else { return state; }
};
