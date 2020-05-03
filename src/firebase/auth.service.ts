import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService, User } from './user.service';

const debug = true;

@Injectable({ providedIn: "root" })
export class AuthService {
  private checkingForAuthUser: boolean = false;
  loggedIn: boolean = false;
  authUser: User;

	constructor(private fbAuth: AngularFireAuth, private router: Router, private userService: UserService) {
    this.checkForLogin();
  }

  checkForLogin(): void {
    this.fbAuth.user.subscribe(user => {
      debug && console.warn('current user: ', user);
      this.loggedIn = !!user;
      if (this.loggedIn) {
        this.router.navigate(['/home']);
        if (!this.authUser && !this.checkingForAuthUser) this.checkForAuthUser(user.uid);
      } else {
        this.router.navigate(['login']);
        this.authUser = undefined;
      }
    });
  }

	loginWithGoogle(type: 'user' | 'restaurant'): Promise<any> {
    return new Promise<any>((resolve, rej) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.fbAuth.signInWithPopup(provider).then(res => {
        if (type === 'user') {
          this.userService.getUser(res.user.uid).then(foundUser => {
            const userData: User = {
              name: res.user.displayName,
              email: res.user.email,
              phone: res.user.phoneNumber,
              id: res.user.uid,
              type: type,
              orders: []
            };
            if (!foundUser.exists) this.userService.addUser(res.user.uid, userData).then(() => this.checkForAuthUser(res.user.uid));
          });
        }
        resolve(res);
      });
    })
	}

	loginWithEmail(): Promise<any> {
    return Promise.resolve();
    // TODO
  }
  
  logout(): Promise<any> {
    return this.fbAuth.signOut().then(res => {
      this.router.navigate(['login']);
    });
  }

  private checkForAuthUser(id: string): void {
    this.checkingForAuthUser = true;
    this.userService.getUser(id).then(user => {
      this.authUser = user.data();
      console.warn("auth user: ", this.authUser);
      this.checkingForAuthUser = false;
    }).catch(err => {
      this.checkingForAuthUser = false;
      // TODO: handle w back up way to login
      throw err;
    });
  }
}