import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore, QuerySnapshot, CollectionReference, DocumentData } from '@angular/fire/firestore';

export interface Restaurant {
  name: string,
  address: Object,
  dishes: Array<any>,
  end: string,
  start: string,
  id: string,
  mon?: boolean,
  tues?: boolean,
  wed?: boolean,
  thurs?: boolean,
  fri?: boolean,
  sat?: boolean,
  sun?: boolean,
  slotsIncrement: number;
  ordersPerSlot: number;
}

@Injectable({ providedIn: "root" })
export class RestaurantService extends FirebaseService {

	constructor(firestore: AngularFirestore) {
    super(firestore, 'restaurants');
  }

  onInit(): void {}
  
  getRestaurants(): CollectionReference {
    return this.getCollectionSnap();
  }

  getRestaurant(id: string): Promise<Restaurant> {
    return this.getDocInCollection(id).then(res => res.data());
  }

  addRestaurant(newRest: Restaurant, name?: string): Promise<void> {
    return this.edit<Restaurant>(newRest, name).catch(err => { throw err; });
  }

}