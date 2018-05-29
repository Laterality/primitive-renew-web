/**
 * Button for file attach
 * 
 * author: Jinwoo Shin
 * date: 2018-05-29
 */
import * as React from "react";

import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";

import { withStyles, WithStyles } from "@material-ui/core";

export interface IAttachButtonProps {
	onChange: (files: FileList | null) => void;
}

const styles = {
	attachButton: {
		position: "relative" as "relative",
		overflow: "hidden",
		background: "#2CDC6D",
		color: "white",
	},
	attachInput: {
		position: "absolute" as "absolute",
		top: 0,
		right: 0,
		minWidth: "100%",
		minHeight: "100%",
		textAlign: "right" as "right",
		filter: "alpha(opcity=0)",
		opacity: 0,
		outline: "none",
		display: "block",
	},
};

type AttachButtonProps = IAttachButtonProps & WithStyles<"attachButton" | "attachInput">;

class AttachButton extends React.Component<AttachButtonProps> {

	public render() {
		const { classes } = this.props;
		return(
			<Button className={classes.attachButton}
				variant="raised">
				<img 
					className="icon mr-2"
					src="/img/baseline-attachment-24px.svg"/>
					파일 첨부
				<input className={classes.attachInput} type="file" onChange={(e) => this.props.onChange(e.target.files) }/>
			</Button>
		);
	}
}

export default withStyles(styles)<IAttachButtonProps>(AttachButton);
