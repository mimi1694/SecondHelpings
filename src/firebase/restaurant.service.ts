import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore, QuerySnapshot, CollectionReference } from '@angular/fire/firestore';

export interface Restaurant {
  name: string,
  address: Object,
  dishes: Array<any>,
  end: string,
  start: string
}

@Injectable({ providedIn: "root" })
export class RestaurantService extends FirebaseService {

	constructor(firestore: AngularFirestore) {
    super(firestore, 'restaurants');
  }

  onInit(): void {}

  addRestaurant(name: string, newRest: Restaurant): Promise<void> {
    return this.put<Restaurant>(name, newRest).catch(err => { throw err; });
  }

  getRestaurants(): CollectionReference {
    return this.getCollectionSnap();
  }

}