/**
 * Side menu comopnent
 * 
 * author: Jinwoo Shin
 * date: 2018-04-30
 */
import * as React from "react";
import { Link } from "react-router-dom";

export interface ISideMenuItem {
	name: string;
	linkTo: string;
}

export interface ISideMenuProps {
	items: ISideMenuItem[];
	onItemClick: (item: ISideMenuItem) => void;
}

export class SideMenu extends React.Component<ISideMenuProps> {

	public render() {
		return (
			<ul className="list-group">
				{this.props.items.map((item: ISideMenuItem, index: number) => {
					return (<li key={index} className="list-group-item" onClick={() => { this.props.onItemClick(item); }}>
						{item.name}
					</li>);
				})}
			</ul>
		);
	}
}
