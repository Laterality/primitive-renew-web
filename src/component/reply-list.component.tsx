/**
 * Reply list component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-15
 */
import * as React from "react";

import { ReplyObject } from "../lib/reply.obj";

import { ReplyListItem } from "./reply-list-item.component";

export interface IReplyListProps {
	replies?: ReplyObject[];
}

export class ReplyList extends React.Component<IReplyListProps> {

	public render() {
		const replies = this.props.replies ?
		this.props.replies.map((rep: ReplyObject) => {
			return (<ReplyListItem 
			key={rep.getId()}
			reply={rep}/>);
		}) : undefined;
		return (
			<div>
				{replies}
			</div>
		);
	}
}
