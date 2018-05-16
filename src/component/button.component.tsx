/**
 * Common button component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-29
 */
import Button from "@material-ui/core/Button";
import * as React from "react";

export interface IButtonProps {
	iconSrc?: string;
	className?: string;
	text: string;
	onClick?: () => void | undefined;
}

export class MyButton extends React.Component<IButtonProps> {

	public render() {
		const elmIcon = this.props.iconSrc ? (<img src={this.props.iconSrc} alt="button" className="icon mr-2" />) : undefined;
		return (<Button variant="raised" className={`bg-primary text-white ${this.props.className ? this.props.className : ""}`} onClick={this.props.onClick}>{elmIcon}{this.props.text}</Button>);
	}
}
