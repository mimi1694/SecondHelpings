import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {

	constructor() {}

	loginWithGoogle(): Promise<any> {
    return Promise.resolve();
	}

	loginWithEmail(): Promise<any> {
		return Promise.resolve();
	}
}