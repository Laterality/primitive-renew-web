/**
 * Member list item component in admin page
 * 
 * author: Jinwoo Shin
 * date: 2018-05-16
 */
import * as React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { UserObject } from "../lib/user.obj";

export interface IMemberListItemProps {
	user: UserObject;
	onClick?: (user: UserObject) => void;
}

export class MemberListItem extends React.Component<IMemberListItemProps> {

	public render() {
		return (
			<ListItem onClick={() => this.props.onClick}>
				<ListItemText primary={`${this.props.user.getName()}(${this.props.user.getSid()})`} secondary={this.props.user.getRole()}/>
			</ListItem>
		);
	}
}
