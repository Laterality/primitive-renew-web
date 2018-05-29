/**
 * API object deserializer
 * 
 * author: Jin-woo Shin
 * date: 2018-04-16
 */

import { FileObject } from "./file.obj";
import { PostObject } from "./post.obj";
import { ReplyObject } from "./reply.obj";
import { UserObject } from "./user.obj";

export class ObjectFactory {

	public static createFileObject(obj: any): FileObject { 
		const file = new FileObject(
			obj["filename"],
			obj["id"],
		);
		return file;
	}

	public static createUserObject(obj: any): UserObject {
		const user = new UserObject(
			obj["sid"],
			obj["name"],
			obj["role"],
			obj["id"],
		);
		return user;
	}

	public static createReplyObject(obj: any): ReplyObject {
		const reply = new ReplyObject(
			obj["reply_content"],
			this.createUserObject(obj["author"]),
			new Date(obj["date_created"]),
			obj["id"],
		);
		return reply;
	}

	public static createPostObject(obj: any): PostObject {
		const files: FileObject[] = [];
		const replies: ReplyObject[] = [];
		if (Array.isArray(obj["files_attached"])) {
			for (const f of obj["files_attached"]) {
				files.push(this.createFileObject(f));
			}
		}
		if (Array.isArray(obj["replies"])) {
			for (const r of obj["replies"]) {
				replies.push(this.createReplyObject(r));
			}
		}
		const post = new PostObject(
			obj["post_title"],
			obj["board"],
			obj["id"],
			obj["post_content"],
			files,
			new Date(obj["date_created"]),
			this.createUserObject(obj["author"]),
			replies,
		);

		return post;
	}
}
