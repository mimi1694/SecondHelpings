import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';

export interface User {
  name: string,
  id: string,
  type: 'restaurant' | 'user',
  orders: Array<any>
}

@Injectable({ providedIn: "root" })
export class UserService extends FirebaseService {
  user: any = {}

	constructor() {
    super();
  }

  addUser(): void {}

  editUser(): void {}

  getUser(id: string): void {}

}