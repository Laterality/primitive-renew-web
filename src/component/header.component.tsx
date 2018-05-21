/**
 * Page header component
 * 
 * author: Jinwoo Shin
 * date: 2018-05-20
 */
import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/ToolBar";
import Typography from "@material-ui/core/Typography";

import MenuIcon from "@material-ui/icons/Menu";

import { Theme, withStyles, WithStyles } from "@material-ui/core";

import { ISessionVerifiable } from "../lib/session-verfying.interface";
import { RoleTitles, UserObject } from "../lib/user.obj";

export interface IHeaderProps {
	user: UserObject | undefined;
	onMenu?: () => void;
}

interface IHeaderState {
	menuAnchorElm: any;
}

const styles = (theme: Theme) => ({
	appBar: {
		marginBottom: "24px",
		positions: "static" as "static",
	},
	menuIcon: {
		marginLeft: -12, 
		marginRight: 20,
	},
	headerTitle: {
		flex: 1,
	},
});

type HeaderProps = IHeaderProps & WithStyles<"appBar" | "menuIcon" | "headerTitle">;

class Header extends React.Component<HeaderProps, IHeaderState> {

	public constructor(props: HeaderProps) {
		super(props);

		this.state = {
			menuAnchorElm: null,
		};
	}

	public render() {
		return (<AppBar className={this.props.classes.appBar} color="default" elevation={4}>
			<Toolbar>
				<IconButton onClick={() => { this.onMenuClick(); }}
				className={this.props.classes.menuIcon}>
					<MenuIcon/>
				</IconButton>
				<Typography variant="title" className={this.props.classes.headerTitle} noWrap>Primitive</Typography>
			</Toolbar>
		</AppBar>);
	}

	private onMenuClick = () => {
		if (this.props.onMenu) {
			this.props.onMenu();
		}
	}
}

export default withStyles(styles, {withTheme: true})<IHeaderProps>(Header);
