import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Dish, DishService } from './dish.service';
import { AuthService } from './auth.service';

type DishCount = {
  [K in string] : {
    quantity: number 
  }
};

export interface Order {
  dishes: DishCount,
  pickup: number,
  rid: string,
  uid: string,
  total: number,
  id: string
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

	constructor(firestore: AngularFirestore, private authService: AuthService, private dishService: DishService) {
    super(firestore, 'orders');
  }

  onInit(): void {}

  getActiveOrder(uid: string): Promise<Order> {
    return this.getCollectionSnap().where('uid', '==', uid).where('active', '==', true).get()
      .then(order => order.docs[0].data() as Order);
  }

  addToOrder(dish: Dish, replaceOrder?: boolean): Promise<any> {
    return this.getActiveOrder(this.authService.authUser.id).then(order => {
      const currentOrder = order;
      let total = 0;

      if (replaceOrder) {
        currentOrder.rid = dish.rid;
        currentOrder.dishes = {
          [dish.id]: { quantity: 1 }
        };
        currentOrder.pickup = null;
      } else {
        if (order.rid !== dish.rid) throw new OrderError("Tried to add a dish that is not from this restaurant.");
        if (currentOrder.dishes[dish.id]) { 
          currentOrder.dishes[dish.id].quantity++;
        } else {
          currentOrder.dishes[dish.id] = { quantity: 1 };
        }
      }

      // look at all the dishes and tally price instead of trusting current total + new dish price
      Object.keys(currentOrder.dishes).forEach(dishId => {
        this.dishService.getDish(dishId).then(dish => {
          total += (currentOrder.dishes[dishId].quantity * dish.data().price);
        });
      });
      currentOrder.total = total;

      return this.put<Order>(this.authService.authUser.id, currentOrder);
    });
  }
}