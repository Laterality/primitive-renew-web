/**
 * Utility functions
 * 
 * author: Jinwoo Shin
 * date: 2018-05-23
 */
import { PostObject } from "./post.obj";
import { UserObject } from "./user.obj";

export function checkPermission(post: PostObject, user: UserObject): boolean {
	if (user.getRole() === "관리자") {
		return true;
	}
	
	const author = post.getAuthor();
	if (author) {
		return author.getId() === user.getId();
	}
	return false;
}

export function formatDate(d: Date) {
	return `${d.getFullYear()}. ${d.getMonth() < 10 ? "0" : ""}${d.getMonth()}. ${d.getDay() < 10 ? "0" : ""}${d.getDay()}`;
}
