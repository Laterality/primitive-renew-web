/**
 * Common button component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import * as React from "react";

export interface IButtonProps {
	iconSrc: string;
	text: string;
	onClick?: () => void | undefined;
}

export class Button extends React.Component<IButtonProps> {
	public render() {
		return (<button className="btn bg-primary text-white text-center"><img src={this.props.iconSrc} alt="button" className="icon mr-2" onClick={this.props.onClick}/>{this.props.text}</button>);
	}
}
