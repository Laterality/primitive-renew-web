/**
 * Reply input box component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-14
 */
import * as jquery from "jquery";
import * as React from "react";

import TextField from "@material-ui/core/TextField";

import { MyButton as Button } from "./button.component";

export interface IReplyInputProps {
	onInputClick: (input: string) => void;
}

export class ReplyInput extends React.Component<IReplyInputProps> {

	public render() {
		return (
		<div className="form-group">
			<TextField className="form-control" id="reply-input" multiline rows={5} label="댓글" placeholder="댓글 입력"/>
			<Button onClick={ () => this.onInputClick() } text="댓글 달기" />
		</div>);
	}

	public onInputClick() {
		const elmInput = jquery("#reply-input");
		const input = elmInput.val();
		elmInput.val("");
		this.props.onInputClick(input as string);
	}

}
