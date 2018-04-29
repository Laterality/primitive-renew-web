/**
 * Index reducer
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import { AnyAction } from "redux";

import { IStore } from "../store";

import { BoardTitle } from "../lib/post.obj";

import { userReducer } from "./user";

import { UserActionType } from "../action/user.action";

const initialState: IStore = {
	user: undefined,
};

export const reduce = (state = initialState, action: AnyAction): IStore => {
	if (action.type in UserActionType) {
		return userReducer(state, action);
	}
	else { return state; }
};
