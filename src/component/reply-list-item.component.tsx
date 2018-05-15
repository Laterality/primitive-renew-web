/**
 * Reply list item component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-15
 */
import * as React from "react";

import { ReplyObject } from "../lib/reply.obj";

export interface IReplyListItemProps {
	reply: ReplyObject;
}

export class ReplyListItem extends React.Component<IReplyListItemProps> {

	public render() {
		return (
			<div>
				<h5>{ this.props.reply.getAuthor().getName() }</h5>
				<h6>{ this.props.reply.getDateCreated().toString() }</h6>
				<p>{ this.props.reply.getContent() }</p>
			</div>);
	}
}
