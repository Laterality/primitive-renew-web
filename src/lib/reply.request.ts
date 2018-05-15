import { default as axios } from "axios";
import * as qs from "querystring";

import { config } from "../config";

export class ReplyAPIRequest {

	public static createReply(postId: string, content: string) {
		return axios(`${config.baseurl}/api/v1/reply/write`, {
			method: "POST",
			data: {
				post_id: postId,
				reply_content: content,
			},
			withCredentials: true,
		});
	}

	public static retrieveReplies(postId: string) {
		return axios(`${config.baseurl}/api/v1/reply/` + postId);
	}
}
