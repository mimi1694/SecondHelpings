import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore, QuerySnapshot, CollectionReference } from '@angular/fire/firestore';

export interface Dish {
  name: string,
  price: string,
  description: string
}

@Injectable({ providedIn: "root" })
export class DishService extends FirebaseService {

	constructor(firestore: AngularFirestore) {
    super(firestore, 'dishes');
  }

  onInit(): void {}

  getDishes(): CollectionReference {
    return this.getCollectionSnap();
  }

  getDish(id: string): Promise<any> {
    return this.getDocInCollection(id);
  }

}