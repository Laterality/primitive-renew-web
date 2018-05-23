/**
 * Reply list item component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-15
 */
import * as React from "react";

import Typography from "@material-ui/core/Typography";

import { withStyles, WithStyles } from "@material-ui/core";

import { formatDate } from "../lib/utils";

import { ReplyObject } from "../lib/reply.obj";

export interface IReplyListItemProps {
	reply: ReplyObject;
}

const styles = {
	author: {
		marginRight: "8px",
		display: "inline-block",
	},
	content: {
		marginTop: "8px",
	},
	date: {
		paddingLeft: "8px",
		display: "inline-block",
		borderLeftColor: "grey",
		borderLeftStyle: "solid" as "solid",
		borderLeftWidth: "1px",
	},
	root: {
		paddignTop: "12px",
		paddingBottom: "12px",
	},
};

type ReplyListItemProps = IReplyListItemProps & WithStyles<"author" | "content" | "date" | "root">;

class ReplyListItem extends React.Component<ReplyListItemProps> {

	public render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Typography variant="subheading" className={classes.author}>{ this.props.reply.getAuthor().getName() }({this.props.reply.getAuthor().getRole()})</Typography>
				<Typography variant="caption" className={classes.date}>{ formatDate(this.props.reply.getDateCreated()) }</Typography>
				<Typography variant="body1">{ this.props.reply.getContent() }</Typography>
			</div>);
	}
}

export default withStyles(styles)<IReplyListItemProps>(ReplyListItem);
