/**
 * Admin page component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-16
 */
import { AxiosResponse, CancelTokenSource, default as axios } from "axios";
import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import SnackBar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";

import { withStyles, WithStyles } from "@material-ui/core";

import { MyButton } from "../component/button.component";
import { MemberList } from "../component/member-list.component";

import { UserActionCreator } from "../action/user.action";

import { ObjectFactory } from "../lib/object-factory";

import { RoleTitles, UserObject } from "../lib/user.obj";

import { UserAPIRequest } from "../lib/user.request";

export interface IAdminContentProps {
	location: any;
	history: any;
}

interface IAdminContentState {
	users: UserObject[];
	userSelectedToUpdate: UserObject | undefined;
	dialogOpened: boolean;
	selectedRoleToCreate: string;
	selectedRoleToSearch: string;
	snackBarUserCreatedOpened: boolean;
	snackBarUserUpdatedOpened: boolean;
	dialogFor: DialogFor;
	inputs: any;
}

enum DialogFor {
	FOR_CREATE = 1,
	FOR_UPDATE = 2,
}

const styles = {
	buttonAdd: {
		float: "right" as "right",
		marginTop: "16px",
	},
	contentPaper: {
		display: "flex",
		flexDirection: "column" as "column",
	},
	selector: {
		paddingRight: "16px",
	},
	title: {},
};

type AdminContentProps = IAdminContentProps & WithStyles<"buttonAdd" | "contentPaper" | "selector" | "title">;

class AdminContent extends React.Component<AdminContentProps, IAdminContentState> {

	private canceler: CancelTokenSource;
	private inputTimer: number | null;

	public constructor(props: AdminContentProps, state: IAdminContentState) {
		super(props);
		this.canceler = axios.CancelToken.source();
		this.inputTimer = null;
		this.state = {
			users: [],
			userSelectedToUpdate: undefined,
			dialogOpened: false,
			selectedRoleToCreate: RoleTitles.junior,
			selectedRoleToSearch: RoleTitles.senior,
			snackBarUserCreatedOpened: false,
			snackBarUserUpdatedOpened: false,
			dialogFor: DialogFor.FOR_CREATE,
			inputs: {
				name: "",
				sid: "",
			},
		};
	}

	public componentDidMount() {
		this.onSearchInputChanged();
	}
	
	public render() {
		const { classes } = this.props;
		const titles: string[] = [];
		for (const i in RoleTitles) {
			titles.push(RoleTitles[i]);
		}
		const menu = titles.map((t: string, i: number) => {
			return (<MenuItem key={i} value={t}>{t}</MenuItem>);
		});
		return (
			<div>
				<Typography variant="headline" 
					className={this.props.classes.title}>관리</Typography>
				<Paper elevation={2}
					className={classes.contentPaper}>
					<div className="container row">
						<TextField id="create-role" 
							value={this.state.selectedRoleToSearch}
							onChange={this.onChangeRoleToSearch} select
							className={["my-3", "col-2", classes.selector].join(" ")}>
								{menu}
						</TextField>
						<TextField id="keyword" type="text" label="검색(이름, 학번)" className="col-10" 
							onChange={this.onSearchInputChanged} fullWidth/>
					</div>
					<MemberList members={this.state.users} 
						onItemClick={this.onMemberItemClick} />
					<div>
						<MyButton text="추가" onClick={this.onAddClick}
							className={classes.buttonAdd}/>
					</div>
				</Paper>
				
				{/* BEGIN: Member add/mod. dialog */}
				<Dialog open={this.state.dialogOpened} 
				onClose={() => this.onCreateDialogClosed(true)}
				aria-labelledby="create-dialog-title">
					<DialogTitle id="create-dialog-title">회원 추가/수정</DialogTitle>
					<DialogContent>
						<TextField id="dialog-name" type="text" label="이름" fullWidth margin="dense" className="my-3" 
						defaultValue={this.state.inputs["name"]} />
						<TextField id="dialog-sid" type="text" label="학번" fullWidth margin="dense" className="my-3" 
						defaultValue={this.state.inputs["sid"]} />
						<TextField id="dialog-password" type="password" label="비밀번호" fullWidth margin="dense" className="my-3" />
						<TextField id="dialog-password-confirm" type="password" label="비밀번호 확인" fullWidth margin="dense" />
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
				{/* END: Member add/mod. dialog */}
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

	private onCreateDialogClosed = (cancelled = true) => {
		if (!cancelled) {
			const name: string = jQuery("#dialog-name").val() as string;
			const sid: string = jQuery("#dialog-sid").val() as string;
			const password: string = jQuery("#dialog-password").val() as string;
			const passwordConfirm: string = jQuery("#dialog-password-confirm").val() as string;
			const pwMatched = password === passwordConfirm;

			if (pwMatched) {
				if (this.state.dialogFor === DialogFor.FOR_CREATE) {
					UserAPIRequest.registerUser(new UserObject(sid, name, this.state.selectedRoleToCreate, ""), password)
					.then((res: AxiosResponse) => {
						if (res.status === 200) {
							// user created
							this.setState({snackBarUserCreatedOpened: true, snackBarUserUpdatedOpened: false});
						}
					});
				}
				else if (this.state.dialogFor === DialogFor.FOR_UPDATE) {
					if (this.state.userSelectedToUpdate) {
						UserAPIRequest.updateUser(this.state.userSelectedToUpdate.getId(), "", password, this.state.selectedRoleToCreate)
						.then((res: AxiosResponse) => {
							if (res.status === 200) {
								this.setState({snackBarUserCreatedOpened: false, snackBarUserUpdatedOpened: true});
								this.onSearchInputChanged();
							}
						});
					}
				}
				this.setState({dialogOpened: false});
			}
			else {
				// TODO: show helper text indicates password not matching with confirm input
			}
		}
		else {
			this.setState({dialogOpened: false});
		}
	}

	private onAddClick = () => {
		this.setState({dialogOpened: true, dialogFor: DialogFor.FOR_CREATE,
		inputs: {
			name: "",
			sid: "",
		},
		selectedRoleToCreate: RoleTitles.junior});
	}

	private onMemberItemClick = (user: UserObject) => {
		this.setState({
			userSelectedToUpdate: user, 
			dialogOpened: true, 
			dialogFor: DialogFor.FOR_UPDATE,
			inputs: {
			name: user.getName(),
			sid: user.getSid()}, 
			selectedRoleToCreate: user.getRole()});
	}

	private onChangeRoleToCreate = (event: any) => {
		this.setState({selectedRoleToCreate: event["target"]["value"]});
	}

	private onChangeRoleToSearch = (event: any) => {
		this.setState({selectedRoleToSearch: event["target"]["value"]}, () => {
			this.onSearchInputChanged();
		});
	}

	private onSnackBarClosed = () => {
		this.setState({snackBarUserCreatedOpened: false, snackBarUserUpdatedOpened: false});
	}

	private onSearchInputChanged = () => {
		const input = jQuery("#keyword").val() as string;

		// Set timer for waiting until tying stops.
		if (this.inputTimer) {
			clearTimeout(this.inputTimer);
			this.inputTimer = null;
		}
		this.inputTimer = window.setTimeout(() => {
			// call search api
			this.inputTimer = null;
			this.canceler.cancel("valid no longer, cancelled");
			this.canceler = axios.CancelToken.source();
			UserAPIRequest.searchUser(input, this.state.selectedRoleToSearch, this.canceler)
			.then((res: AxiosResponse) => {
				if (res.status === 200) {
					const users: UserObject[] = res.data["users"].map((user: any) => {
						return ObjectFactory.createUserObject(user);
					});
					this.setState({users});
				}
				else {
					console.log("Failed to search");
				}
			})
			.catch((err: any) => {
				console.log("search user err, ", err);
			});
		}, 800);
	}
}

export default withStyles(styles)<IAdminContentProps>(AdminContent);
