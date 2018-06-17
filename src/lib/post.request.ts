import { default as axios } from "axios";
import * as qs from "querystring";

import { config } from "../config";

import { PostObject } from "./post.obj";

export class PostAPIRequest {

	public static createPost = (title: string, content: string, boardTitle: string, fileIds: string[]) => {
		return axios(`${config.baseurl}/api/v1/post/write`, {
				method: "POST",
				data: {
					post_title: title,
					post_content: content,
					board_title: boardTitle,
					files_attached: fileIds,
				},
				withCredentials: true,
			});
	}

	public static retrievePostList = (page: number, year: number, boardTitle: string) => {
		return axios(
			`${config.baseurl}/api/v1/post/page/${page}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				params: {
					year,
					board_title: boardTitle,
				},
				withCredentials: true,
			});
	}

	public static retrievePostById = (postId: string | number) => {
		return axios(`${config.baseurl}/api/v1/post/${postId}`, {
			method: "GET",
			withCredentials: true,
		});
	}

	/**
	 * 게시물 수정
	 * 
	 * files 배열은 기존 상태를 유지하는 경우 null값
	 */
	public static updatePost = (postId: string, title: string, content: string, files: string[] | null) => {
		return axios(
			`${config.baseurl}/api/v1/post/update/${postId}`,
			{
				method: "PUT",
				data: {
					post_title: title,
					post_content: content,
					files_attached: files,
				},
				withCredentials: true,
			});
	}

	public static deletePost = (postId: string | number) => {
		return axios(
			`${config.baseurl}/api/v1/post/delete/${postId}`, {
				method: "DELETE",
				withCredentials: true,
			});
	}
}
