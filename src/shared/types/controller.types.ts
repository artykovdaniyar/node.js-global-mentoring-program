interface KeyValueObject {
	[key: string]: any;
}

export interface IControllerResponse {
	data: KeyValueObject;
	error: string | null;
}
