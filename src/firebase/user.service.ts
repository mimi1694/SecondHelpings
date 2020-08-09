import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';

export interface User {
  name: string,
  email: string,
  phone: string,
  id: string,
  type: 'restaurant' | 'user',
  orders: Array<any>
}

@Injectable({ providedIn: "root" })
export class UserService extends FirebaseService {

	constructor(firestore: AngularFirestore) {
    super(firestore, 'users');
  }

  onInit(): void {}

  addUser(newUser: User, id?: string): Promise<void> {
    return this.edit<User>(newUser, id).catch(err => { throw err; });
  }

  getUser(userId: string): Promise<DocumentData> {
    return this.getDocInCollection(userId);
  }

  editUser(): void {}

}