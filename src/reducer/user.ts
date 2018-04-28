/**
 * User reducer
 * 
 * author: Jinwoo Shin
 * date: 2018-04-28
 */
import { AnyAction } from "redux";

import { IStore } from "../store/index";

import { IAddUserAction, UserActionType } from "../action/user.action";

export const userReducer = (state: IStore, action: AnyAction | IAddUserAction): IStore => {
	const newState = Object.assign({}, state);

	switch (action.type) {
		case UserActionType.SET_USER: 
			newState.user = (action as IAddUserAction).user;
			return newState;
		case UserActionType.INVALIDATE_USER:
			newState.user = undefined;
			return newState;
		default:
			return state;
	}
};
