/**
 * Reply input box component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-14
 */
import * as jquery from "jquery";
import * as React from "react";

import TextField from "@material-ui/core/TextField";

import { withStyles, WithStyles } from "@material-ui/core";

import { MyButton as Button } from "./button.component";

export interface IReplyInputProps {
	onInputClick: (input: string) => void;
}

const styles = {
	root: {
		marginBottom: "24px",
	},
	submitButton: {
		marginTop: "16px",
	},
};

type ReplyInputProps = IReplyInputProps & WithStyles<"root" | "submitButton">;

class ReplyInput extends React.Component<ReplyInputProps> {

	public render() {
		const { classes } = this.props;
		return (
		<div className={classes.root}>
			<TextField className="form-control" id="reply-input" multiline rows={5} label="댓글" placeholder="댓글 입력"/>
			<Button className={classes.submitButton}
			onClick={ () => this.onInputClick() } text="댓글 달기" />
		</div>);
	}

	public onInputClick() {
		const elmInput = jquery("#reply-input");
		const input = elmInput.val();
		elmInput.val("");
		this.props.onInputClick(input as string);
	}

}

export default withStyles(styles)<IReplyInputProps>(ReplyInput);
