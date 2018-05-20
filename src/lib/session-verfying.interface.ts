import { AxiosResponse } from "axios";

import { ObjectFactory } from "./object-factory";

import { UserObject } from "./user.obj";
import { UserAPIRequest } from "./user.request";

export interface ISessionVerifiable {
	user: UserObject | undefined;
	onSessionVerified: (user: UserObject) => void;
}

export const verifySession = (verifiable: ISessionVerifiable, callback?: (signed: boolean) => void) => {
	if (!verifiable.user) {
		UserAPIRequest.checkSignedIn()
		.then((res: AxiosResponse) => {
			const body = res.data;
			if (body["state"]["signed"]) {
				verifiable.onSessionVerified(ObjectFactory.createUserObject(body["state"]["user"]));
				if (callback) {
					callback(true);
				}
			}
			else {
				if (callback) {
					callback(false);
				}
			}
		});
	}
	else {
		if (callback) {
			callback(true);
		}
	}
};
