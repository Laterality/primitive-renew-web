/**
 * Client-side user api object
 * 
 * author: Jin-woo Shin
 * date: 2018-04-16
 */

export enum RoleTitles {
	junior = "신입생",
	senior = "재학생",
	graduated = "졸업생",
}

export class UserObject {

	public constructor(
		private sid: string,
		private name: string,
		private role: string,
		private id: string,
	) { }

	public getSid() { return this.sid; }
	public getName() { return this.name; }
	public getRole() { return this.role; }
	public getId() { return this.id; }
}
