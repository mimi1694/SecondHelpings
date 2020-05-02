import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class AuthService {
  user = {
    loggedIn: false,
    info: {}
  };

	constructor(private fbAuth: AngularFireAuth, private router: Router) { }

	loginWithGoogle(): Promise<any> {
    return new Promise<any>((resolve, rej) => {
      console.warn(firebase.auth);
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.fbAuth.signInWithPopup(provider).then(res => {
        this.user.loggedIn = true;
        this.user.info = res.user;
        if (res.additionalUserInfo.isNewUser) {
          // add to database
        } else {
          this.router.navigate(['/home']);
        }

        resolve(res);
      });
    })
	}

	loginWithEmail(): Promise<any> {
		return Promise.resolve();
	}
}