/**
 * My-page page component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-15
 */
import { AxiosResponse } from "axios";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import SnackBar from "@material-ui/core/SnackBar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { withStyles, WithStyles } from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

import { MyButton as Button } from "../component/button.component";

import { UserActionCreator } from "../action/user.action";

import { ISessionVerifiable, verifySession } from "../lib/session-verfying.interface";
import { IStore } from "../store";

import { ObjectFactory } from "../lib/object-factory";

import { UserObject } from "../lib/user.obj";

import { UserAPIRequest } from "../lib/user.request";

export interface IMyPageContentProps {
	history: any;
	location: any;
	user: UserObject;
}

interface IMyPageContentState {
	snackBarUserUpdatedOpened: boolean;
}

const styles = {
	buttonSubmit: {
		float: "right" as "right",
		marginTop: "16px",
	},
	paper: {
		display: "flex",
		flexDirection: "column" as "column",
	},
	title: {},
	field: {
		marginTop: "8px",
		marginBottom: "8px",
	},
};

type MyPageContentProps = IMyPageContentProps & WithStyles<"buttonSubmit" | "field" | "paper" | "title">;

class MyPageContent extends React.Component<MyPageContentProps, IMyPageContentState> {

	public constructor(props: MyPageContentProps) {
		super(props);

		this.state = {
			snackBarUserUpdatedOpened: false,
		};
	}

	public render() {
		const { classes } = this.props;
		return (
		<div>
			<Typography variant="headline" className={classes.title}>
				마이페이지
			</Typography>
			<Paper elevation={2} className={classes.paper}>
				<FormControl className={classes.field} disabled fullWidth>
					<InputLabel htmlFor="username" >아이디</InputLabel>
					<Input id="username" type="text" 
						value={this.props.user ? this.props.user.getSid() : ""} className="text-dark" fullWidth={true}/>
				</FormControl>
				<FormControl className={classes.field} disabled fullWidth>
					<InputLabel htmlFor="name" >이름</InputLabel>
					<Input id="name" type="text" 
						value={this.props.user ? this.props.user.getName() : ""} className="text-dark" fullWidth={true}/>
				</FormControl>
				<FormControl className={classes.field} disabled fullWidth>
					<InputLabel htmlFor="role" >등급</InputLabel>
					<Input id="role" type="text" 
						value={this.props.user ? this.props.user.getRole() : ""} className="text-dark" fullWidth={true} />
				</FormControl>
				<TextField id="password-current" className={classes.field}
				type="password" label="현재 비밀번호" fullWidth/>
				<TextField id="password-new" className={classes.field}
				type="password" label="새 비밀번호" fullWidth/>
				<TextField id="password-new-confirm" className={classes.field}
				type="password" label="새 비밀번호 확인" fullWidth/>
				<div>
					<Button text="완료" className={classes.buttonSubmit}
					iconSrc="/img/ic_create_white_48px.svg"
					onClick={() => this.onSubmitClick()}/>
				</div>
			</Paper>
			<SnackBar anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}} 
				open={this.state.snackBarUserUpdatedOpened}
				onClose={this.onSnackBarClosed}
				autoHideDuration={1500}
				ContentProps={{
					"aria-describedby": "text-user-created",
				}}
				message={<span id="text-user-created">수정되었습니다</span>} 
				action={[<IconButton
					color="inherit"
					onClick={this.onSnackBarClosed}>
					<CloseIcon />
				</IconButton>]} />
		</div>);
	}

	private onSnackBarClosed = () => {
		this.setState({snackBarUserUpdatedOpened: false});
	}

	private onSubmitClick = () => {
		const pwCurrent = jQuery("#password-current");
		const pwNew = jQuery("#password-new");
		const pwConfirm = jQuery("#password-new-confirm");
		const pwMatched = (pwNew.val() as string) === 
		(pwConfirm.val() as string);
		console.log(pwNew.val(), " === ", pwConfirm.val(), pwMatched);
		if (pwMatched) {
			UserAPIRequest.updateUser(this.props.user.getId(), 
				pwCurrent.val() as string, pwNew.val() as string, this.props.user.getRole())
			.then((res: AxiosResponse) => {
				if (res.status === 200) {
					this.setState({snackBarUserUpdatedOpened: true});
					pwCurrent.val("");
					pwNew.val("");
					pwConfirm.val("");
				}
			});
		}
	}
}

const mapStateToProps = (state: IStore) => {
	return {
		user: state.user,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		onSessionVerified: (user: UserObject) => {
			dispatch(UserActionCreator.setUser(user));
		},
	};
};

export default withStyles(styles)<IMyPageContentProps>(MyPageContent);
