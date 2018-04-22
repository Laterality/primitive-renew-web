/**
 * User API requester
 * 
 * author: Jinwoo Shin
 * date: 2018-04-18
 */
import { default as axios } from "axios";

import { config } from "../config";
import { UserObject } from "./user.obj";

export class UserAPIRequest {

	public static registerUser = (user: UserObject, pw: string) => {
		return axios.post(
			`${config.baseurl}/api/v1/user/register`,
			{
				name: user.getName(),
				sid: user.getSid(),
				password: pw,
				role: user.getRole(),
			});
	}

	public static loginUser = (id: string, pw: string) => {
		// return axios.post(
		// 	`${config.baseurl}/api/v1/auth/login`,
		// 	{
		// 		id,
		// 		pw,
		// 	},
		// );
		return axios(`${config.baseurl}/api/v1/auth/login`, {
			method: "POST",
			data: {
				id,
				pw,
			},
			withCredentials: true,
		});
		// return fetch(
		// 	`${config.baseurl}/api/v1/auth/login`,{
		// 		method: "POST",
		// 		body: JSON.stringify({
		// 			id,
		// 			pw,
		// 		}),
		// 		credentials: "include",
		// 	},
		// );
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
}
