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
			`${config.baseurl}/api/v1/post/page/${page}?year=${year}&board_title=${boardTitle}`, {
				method: "GET",
				withCredentials: true,
			});
	}

	public static retrievePostById = (postId: string | number) => {
		return axios(`${config.baseurl}/api/v1/post/${postId}`, {
			method: "GET",
			withCredentials: true,
		});
	}

	public static updatePost = (post: PostObject) => {
		return axios(
			`${config.baseurl}/api/v1/post/update/${post.getId()}`,
			{
				method: "PUT",
				data: {
					post_title: post.getTitle(),
					post_content: post.getContent(),
					files_attached: post.getFilesAttached(),
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
