import * as jquery from "jquery";
import * as React from "react";

export interface IReplyInputProps {
	onInputClick: (input: string) => void;
}

export class ReplyInput extends React.Component<IReplyInputProps> {

	public render() {
		return (
		<div className="form-group">
			<textarea className="form-control" id="reply-input" rows={5} placeholder="댓글 입력"/>
			<button className="btn bg-primary" onClick={ () => this.onInputClick() }>댓글 달기</button>
		</div>);
	}

	public onInputClick() {
		const elmInput = jquery("#reply-input");
		const input = elmInput.val();
		elmInput.val("");
		this.props.onInputClick(input as string);
	}

}
