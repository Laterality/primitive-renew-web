/**
 * Page header component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-20
 */
import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/ToolBar";
import Typography from "@material-ui/core/Typography";

import { ISessionVerifiable } from "../lib/session-verfying.interface";
import { RoleTitles, UserObject } from "../lib/user.obj";

export interface IHeaderProps {
	user: UserObject | undefined;
	onLogoClick?: () => void;
	onLogout?: () => void;
	onMyPage?: () => void;
	onAdmin?: () => void;
}

interface IHeaderState {
	menuAnchorElm: any;
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {

	public constructor(props: IHeaderProps) {
		super(props);

		this.state = {
			menuAnchorElm: null,
		};
	}

	public render() {
		return (<AppBar 
			style={{
				marginBottom: "24px";
			}}
		position="static" color="default" elevation={4}>
			<Toolbar>
				<Button onClick={() => { this.onLogoClick(); }}
				disableFocusRipple={true}
				disableRipple={true}>
					<img className="header-logo" src="/img/primitive_logo.svg" alt="로고" 
					style={{
						height: "1.8rem",
						marginTop: "0.5rem",
						marginBottom: "0.5rem",
						marginLeft: -12, 
						marginRight: 20}}/>
				</Button>
				<Typography variant="title" style={{flex: 1}}></Typography>
				<div>
					<Button className="header-menu"
					onClick={(e) => { this.onClickMenu(e); }}>
						{this.props.user ? this.props.user.getName() : ""} ({this.props.user ? this.props.user.getRole() : ""})
					</Button>
					<Menu 
						open={Boolean(this.state.menuAnchorElm)}
						anchorEl={this.state.menuAnchorElm}
						anchorOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						transformOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						onClose={() => { this.onCloseMenu(); }}>
						{(this.props.user ? this.props.user.getRole() === "관리자" : false) && <MenuItem onClick={() => { this.onAdminClick(); }}>관리</MenuItem>}
						<MenuItem onClick={() => { this.onMyPageClick(); }}>마이페이지</MenuItem>
						<MenuItem onClick={() => { this.onLogoutClick(); }}>로그아웃</MenuItem>
					</Menu>
				</div>
			</Toolbar>
		</AppBar>);
	}

	private onLogoClick = () => {
		if (this.props.onLogoClick) {
			this.props.onLogoClick();
		}
	}

	private onClickMenu = (elm: any) => {
		this.setState({menuAnchorElm: elm.currentTarget});
	}

	private onCloseMenu = () => {
		this.setState({menuAnchorElm: null});
	}

	private onAdminClick = () => {
		if (this.props.onAdmin) {
			this.props.onAdmin();
		}
	}

	private onLogoutClick = () => {
		if (this.props.onLogout) {
			this.props.onLogout();
		}
		this.onCloseMenu();
	}

	private onMyPageClick = () => {
		if (this.props.onMyPage) {
			this.props.onMyPage();
		}
		this.onCloseMenu();
	}
}
