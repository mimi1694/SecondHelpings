import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  addUser(id: string, newUser: User): Promise<void> {
    return this.put<User>(id, newUser).catch(err => { throw err; });
  }

  getUser(userId: string): Promise<any> {
    return this.getDocInCollection(userId);
  }

  editUser(): void {}

}