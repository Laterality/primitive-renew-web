/**
 * Post reducer
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import { AnyAction } from "redux";

import { ISetPostsAction, PostActionType } from "../action/post.action";

import { IStore } from "../store";

export const postReducer = (state: IStore, action: AnyAction | ISetPostsAction): IStore => {
	const newState = Object.assign({}, state);

	switch (action.type) {
		case PostActionType.SET_POSTS:
			state.posts[(action as ISetPostsAction).title] = (action as ISetPostsAction).posts;
			return newState;
		default:
			return state;
	}
};
