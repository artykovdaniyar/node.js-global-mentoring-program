export class User {
	constructor(
		readonly name: string,
		readonly email: string,
		readonly id: string,
		readonly hobbies: string[],
	) {}
}
