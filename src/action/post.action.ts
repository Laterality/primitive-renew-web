/**
 * Actions for Redux relevant to Post
 * 
 * author: Jinwoo Shin
 * date: 2018-04-28
 */
import { AnyAction } from "redux";
import { BoardTitle, PostObject } from "../lib/post.obj";

export enum PostActionType {
	SET_POSTS = "SET_POSTS",
}

export interface ISetPostsAction extends AnyAction{
	title: BoardTitle;
	posts: PostObject[];
}

export class PostActionCreator {

	public setPosts(boardTitle: BoardTitle, posts: PostObject[]): ISetPostsAction {
		return {
			type: PostActionType.SET_POSTS,
			title: boardTitle,
			posts,
		};
	}
}
