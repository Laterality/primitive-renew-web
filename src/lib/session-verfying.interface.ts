import { UserObject } from "./user.obj";

export interface ISessionVerifiable {
	onSessionVerified: (user: UserObject) => void;
}
