import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

const debug = false;

@Injectable({ providedIn: "root" })
export class AuthService {
  loggedIn: boolean = false;

	constructor(private fbAuth: AngularFireAuth, private router: Router) {
    this.checkForLogin();
  }

  checkForLogin(): void {
    this.fbAuth.user.subscribe(user => {
      debug && console.warn('current user: ', user);
      this.loggedIn = !!user;
      if (this.loggedIn) this.router.navigate(['/home']);
      else this.router.navigate(['login']);
    });
  }

	loginWithGoogle(type: 'user' | 'restaurant'): Promise<any> {
    return new Promise<any>((resolve, rej) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.fbAuth.signInWithPopup(provider).then(res => {
        if (res.additionalUserInfo.isNewUser) {
          // add to database
        }
        resolve(res);
      });
    })
	}

	loginWithEmail(): Promise<any> {
		return Promise.resolve();
  }
  
  logout(): Promise<any> {
    return this.fbAuth.signOut().then(res => {
      this.router.navigate(['login']);
    });
  }
}