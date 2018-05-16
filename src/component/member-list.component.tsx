/**
 * Member list component in admin page
 * 
 * author: Jinwoo Shin
 * date: 2018-05-16
 */
import * as React from "react";

import List from "@material-ui/core/List";

import { MemberListItem } from "./member-list-item";

import { UserObject } from "../lib/user.obj";

export interface IMemberListProps {
	members: UserObject[];
	onItemClick?: (user: UserObject) => void;
}

export class MemberList extends React.Component<IMemberListProps> {
	public render() {
		return (
			<List>
				{this.props.members.map((user: UserObject) => {
					return <MemberListItem key={user.getId()} user={user} onClick={this.props.onItemClick} />;
				})}
			</List>);
	}
}
