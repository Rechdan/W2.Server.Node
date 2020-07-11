export namespace DB {
	export enum UserCategory {
		PLAYER = 'player',
		ADMIN = 'admin',
	}

	export interface User {
		id: number;
		category: UserCategory;
		username: string;
		password: string;
		numeric: string;
		created: Date;
	}
}
