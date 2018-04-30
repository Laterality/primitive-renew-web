import { AnyAction } from "redux";

import * as navAction from "../action/navigation.action";

import { IStore } from "../store/index";

export const navigationReducer = (state: IStore, action: AnyAction) => {
	const newState = Object.assign({}, state);

	switch (action.type) {
		case navAction.NavigationActionType.SET_BOARD_TITLE:
			newState.current.boardTitle = (action as navAction.ISetBoardTitleAction).title;
			return newState;
		case navAction.NavigationActionType.SET_PAGE_NUM:
			newState.current.page = (action as navAction.ISetPageNumAction).numPage;
			return newState;
		case navAction.NavigationActionType.SET_POST:
			newState.current.post = (action as navAction.ISetPostAction).post;
			return newState;
		default:
			return state;
	}
};
