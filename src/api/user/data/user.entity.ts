export default class User {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly email: string,
		readonly hobbies: string[],
	) {}
}
