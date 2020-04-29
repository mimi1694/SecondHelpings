import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: "root" })
export class UserService extends FirebaseService {

    constructor() {
        super();
    }
}