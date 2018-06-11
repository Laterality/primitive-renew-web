/**
 * User API requester
 * 
 * author: Jinwoo Shin
 * date: 2018-04-18
 */
import { CancelTokenSource, default as axios} from "axios";

import { config } from "../config";
import { UserObject } from "./user.obj";

export class UserAPIRequest {

	public static registerUser = (user: UserObject, pw: string) => {
		return axios(
			`${config.baseurl}/api/v1/user/register`, {
				method: "POST",
				data: {
					name: user.getName(),
					sid: user.getSid(),
					password: pw,
					role: user.getRole(),
				},
				withCredentials: true,
			});
	}

	public static loginUser = (sid: string, pw: string) => {
		return axios(`${config.baseurl}/api/v1/auth/login`, {
			method: "POST",
			data: {
				id: sid,
				pw,
			},
			validateStatus: () => true,
			withCredentials: true,
		});
	}

	public static logoutUser = () => {
		return axios(`${config.baseurl}/api/v1/auth/logout`, {
			method: "GET",
			withCredentials: true,
		});
	}

	public static checkSignedIn = () => {
		return axios(`${config.baseurl}/api/v1/auth/check`, {
			method: "GET",
			withCredentials: true,
		});
	}

	public static searchUser = (key: string, role: string, canceler?: CancelTokenSource) => {
		if (canceler) {
			return axios(`${config.baseurl}/api/v1/user/find-by-name-or-sid`, {
				cancelToken: canceler.token,
				method: "GET",
				params: {
					key,
					roles: role,
				},
				withCredentials: true,
			});
		}
		else {
			return axios(`${config.baseurl}/api/v1/user/find-by-name-or-sid`, {
				method: "GET",
				params: {
					key,
					roles: role,
				},
				withCredentials: true,
			});
		}
	}

	public static updateUser = (id: string, pwCurrent: string, pwNew: string, roleTitleNew: string) => {
		return axios(`${config.baseurl}/api/v1/user/update/${id}`, {
			method: "PUT",
			data: {
				current_password: pwCurrent, 
				new_password: pwNew,
				role: roleTitleNew,
			},
			withCredentials: true,
		});
	}
}
