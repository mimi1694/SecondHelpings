import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';

@Injectable({ providedIn: "root" })
export class AuthService {
  user = {
    loggedIn: false
  };

	constructor() { 
    if (!firebase) {
      console.warn("EXISTS");
      this.user.loggedIn = true;
    }
  }

  userLoggedIn(): boolean { return this.user.loggedIn; }

	loginWithGoogle(): Promise<any> {
    return Promise.resolve();
	}

	loginWithEmail(): Promise<any> {
		return Promise.resolve();
	}
}