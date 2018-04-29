/**
 * Actions for Redux relevant to User
 * 
 * author: Jinwoo Shin
 * date: 2018-04-28
 */
import { AnyAction } from "redux";
import { UserObject } from "../lib/user.obj";

export enum UserActionType {
	SET_USER = "SET_USER",
	INVALIDATE_USER = "INVALIDATE_USER",
}

export interface ISetUserAction extends AnyAction {
	user: UserObject | undefined;
}

export class UserActionCreator {

	public static setUser(user: UserObject | undefined): ISetUserAction {
		return {
			type: UserActionType.SET_USER,
			user,
		};
	}

	public static invalidateUser() {
		return {
			type: UserActionType.INVALIDATE_USER,
		};
	}
}
