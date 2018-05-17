/**
 * Admin page component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-16
 */
import { AxiosResponse } from "axios";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import SnackBar from "@material-ui/core/SnackBar";
import TextField from "@material-ui/core/TextField";

import CloseIcon from "@material-ui/icons/Close";

import { MyButton } from "../component/button.component";
import { MemberList } from "../component/member-list.component";

import { RoleTitles, UserObject } from "../lib/user.obj";

import { UserAPIRequest } from "../lib/user.request";

import { ISessionVerifiable } from "../lib/session-verfying.interface";

export interface IAdminPageProps extends ISessionVerifiable {
	location: any;
	history: any;
}

export interface IAdminPageState {
	users: UserObject[];
	createDialogOpened: boolean;
	modifyDialogOpened: boolean;
	selectedRoleToCreate: string;
	snackBarUserCreatedOpened: boolean;
}

class AdminPage extends React.Component<IAdminPageProps, IAdminPageState> {

	public constructor(props: IAdminPageProps, state: IAdminPageState) {
		super(props);

		this.state = {
			users: [],
			createDialogOpened: false,
			modifyDialogOpened: false,
			selectedRoleToCreate: RoleTitles.junior,
			snackBarUserCreatedOpened: false,
		};
	}
	
	public render() {
		const titles: string[] = [];
		for (const i in RoleTitles) {
			titles.push(RoleTitles[i]);
		}
		return (
			<div>
				<TextField id="keyword" type="text" label="검색(이름, 학번)" fullWidth={true} />
				<MemberList members={this.state.users} />
				<MyButton text="추가" onClick={this.onAddClick}/>
				<Dialog open={this.state.createDialogOpened} 
				onClose={() => this.onCreateDialogClosed(true)}
				aria-labelledby="create-dialog-title">
					<DialogTitle id="create-dialog-title">회원 추가</DialogTitle>
					<DialogContent>
						<TextField id="create-name" type="text" label="이름" fullWidth margin="dense" className="my-3"/>
						<TextField id="create-sid" type="text" label="학번" fullWidth margin="dense" className="my-3" />
						<TextField id="create-password" type="password" label="비밀번호" fullWidth margin="dense" className="my-3" />
						<TextField id="create-password-confirm" type="password" label="비밀번호 확인" fullWidth margin="dense" />
						<TextField id="create-role" 
						label="등급"
						value={this.state.selectedRoleToCreate}
						onChange={this.onChangeRoleToCreate} fullWidth select
						className="my-3">
							{titles.map((t: string, i: number) => {
								return (<MenuItem key={i} value={t}>{t}</MenuItem>);
							})}
						</TextField>
					</DialogContent>
					<DialogActions>
						<Button className="px-4" onClick={() => this.onCreateDialogClosed(false)} color="primary">확인</Button>
						<Button className="px-4" onClick={() => this.onCreateDialogClosed(true)} color="primary">취소</Button>
					</DialogActions>
				</Dialog>
				<SnackBar anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}} 
				open={this.state.snackBarUserCreatedOpened}
				onClose={this.onSnackBarClosed}
				autoHideDuration={1500}
				ContentProps={{
					"aria-describedby": "text-user-created",
				}}
				message={<span id="text-user-created">생성되었습니다</span>} 
				action={[<IconButton
					color="inherit"
					onClick={this.onSnackBarClosed}>
					<CloseIcon />
				</IconButton>]} />
			</div>);
	}

	private onCreateDialogClosed = (cancelled = true) => {
		if (!cancelled) {
			const name: string = jQuery("#create-name").val() as string;
			const sid: string = jQuery("#create-sid").val() as string;
			const password: string = jQuery("#create-password").val() as string;
			const passwordConfirm: string = jQuery("#create-password-confirm").val() as string;
			const pwMatched = password === passwordConfirm;
			console.log("add user: ", {
				name,
				sid,
				password,
				pw_matched: password + "===" + passwordConfirm + ": " + pwMatched,
			});

			if (pwMatched) {
				UserAPIRequest.registerUser(new UserObject(sid, name, this.state.selectedRoleToCreate), password)
				.then((res: AxiosResponse) => {
					if (res.status === 200) {
						// user created
						this.setState({snackBarUserCreatedOpened: true});
					}
				});
				this.setState({createDialogOpened: false});
			}
			else {
				// TODO: show helper text indicates password not matching with confirm input
			}
		}
		else {
			this.setState({createDialogOpened: false});
		}
	}

	private onAddClick = () => {
		this.setState({createDialogOpened: true});
	}

	private onChangeRoleToCreate = (event: any) => {
		this.setState({selectedRoleToCreate: event["target"]["value"]});

	}

	private onSnackBarClosed = () => {
		this.setState({snackBarUserCreatedOpened: false});
	}

}

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
