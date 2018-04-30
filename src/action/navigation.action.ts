/**
 * Navigation state actions
 * 
 * author: Jinwoo Shin
 * date: 2018-04-30
 */
import { AnyAction } from "redux";

import { BoardTitle, PostObject } from "../lib/post.obj";

export enum NavigationActionType {
	SET_BOARD_TITLE = "SET_BOARD_TITLE",
	SET_PAGE_NUM = "SET_PAGE_NUM",
	SET_POST = "SET_POST",
}

export interface ISetBoardTitleAction extends AnyAction {
	title: BoardTitle;
}

export interface ISetPageNumAction extends AnyAction {
	numPage: number;
}

export interface ISetPostAction extends AnyAction {
	post: PostObject;
}

export class NavigationActionCreator {

	public static setBoardTitle(boardTitle: BoardTitle): ISetBoardTitleAction {
		return {
			type: NavigationActionType.SET_BOARD_TITLE,
			title: boardTitle,
		};
	}

	public static setPageNum(numPage: number): ISetPageNumAction {
		return {
			type: NavigationActionType.SET_PAGE_NUM,
			numPage,
		};
	}

	public static setPost(post: PostObject): ISetPostAction {
		return {
			type: NavigationActionType.SET_POST,
			post,
		};
	}
}
