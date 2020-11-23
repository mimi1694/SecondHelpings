import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Dish, DishService } from './dish.service';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

export type DishCount = {
  [K in string] : number 
};

export interface Order {
  dishes: DishCount,
  pickup: number,
  rid: string,
  uid: string,
  total: number,
  id?: string,
  active: boolean
}

export class OrderError extends Error {
  type: "RestaurantMismatch" | undefined;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

@Injectable({ providedIn: "root" })
export class OrderService extends FirebaseService {
  id: string = "";

	constructor(firestore: AngularFirestore, private authService: AuthService, private dishService: DishService) {
    super(firestore, 'orders');
  }
  
  onInit(): void {
    this.authService.authUser.pipe(filter(authUser => authUser && !!authUser.id)).subscribe(authUser => this.id = authUser.id);
  }

  getActiveOrder(uid: string): Promise<Order | undefined> {
    return this.getActiveOrderSnap(uid).get().then(order => order.docs[0] ? order.docs[0].data() as Order : undefined);
  }

  getActiveOrderSnap(uid: string) {
    return this.getCollectionSnap().where('uid', '==', uid).where('active', '==', true);
  }

  addToOrder(dish: Dish, replaceOrder?: boolean): Promise<any> {
    let currentOrder, total;
    return this.getActiveOrder(this.id)
    .then(order => {
      total = 0;
      if (order) {
        currentOrder = order;
      } else {
        currentOrder = {
          dishes: {},
          pickup: null,
          rid: dish.rid,
          uid: this.id,
          total,
          active: true
        };
      }

      if (replaceOrder) {
        currentOrder.rid = dish.rid;
        currentOrder.dishes = {
          [dish.id]: 1
        };
        currentOrder.pickup = null;
      } else {
        if (!currentOrder.rid.length) currentOrder.rid = dish.rid;
        else if (currentOrder.rid.length && currentOrder.rid !== dish.rid) throw new OrderError("Tried to add a dish that is not from this restaurant.");

        if (currentOrder.dishes[dish.id]) { 
          currentOrder.dishes[dish.id]++;
        } else {
          currentOrder.dishes[dish.id] = 1;
        }
      }

      // look at all the dishes and tally price instead of trusting current total + new dish price
      return Promise.all(
        Object.keys(currentOrder.dishes).map(dishId => this.dishService.getDish(dishId).then((dish: Dish) => {
          total += (currentOrder.dishes[dishId] * dish.price);
        })
      ))
    }).then(() => {
      currentOrder.total = total;
      return currentOrder.id ? this.edit<Order>(currentOrder, currentOrder.id) : this.put<Order>(currentOrder).then(() => {});
    });
  }

  updateOrder(oldOrder: Order, updates: Partial<Order>): Promise<void> {
    const newOrder = Object.assign({}, oldOrder);
    Object.keys(updates).forEach(key => {
      newOrder[key] = updates[key]
    });
    return this.getActiveOrder(this.id).then(order => {
      order.active = false;
      return this.edit<Order>(newOrder, order.id);
    })
  }

  processCart(): Promise<any> {
    return this.getActiveOrder(this.id).then(order => {
      const currentOrder = order;
      order.active = false;
      return this.edit<Order>(currentOrder, order.id);
    }).then(() => this.put<Order>({
      dishes: {},
      pickup: 0,
      rid: "",
      uid: this.id,
      total: 0,
      active: true,
    }));
  }
}