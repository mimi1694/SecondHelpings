import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore, QuerySnapshot, CollectionReference, DocumentData } from '@angular/fire/firestore';

export interface Dish {
  name: string,
  price: string,
  description: string,
  rid: string,
  id: string
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

  getDish(id: string): Promise<DocumentData> {
    return this.getDocInCollection(id);
  }

}