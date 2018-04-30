/**
 * Redux store
 * 
 * author: Jinwoo Shin
 * date: 2018-04-28
 */
import * as redux from "redux";

import { BoardTitle, PostObject } from "../lib/post.obj";
import { UserObject } from "../lib/user.obj";
import { reduce } from "../reducer";

export interface ICurrentNavigation {
	boardTitle: BoardTitle;
	page: number;
	post: PostObject | undefined;
}

export interface IStore {
	user: UserObject | undefined;
	current: ICurrentNavigation;
}

export const store = redux.createStore(reduce);
