import { Component, OnInit } from "@angular/core";
import { Order, OrderService } from 'src/firebase/order.service';
import { Dish, DishService } from 'src/firebase/dish.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PaidComponent } from './paid/paid.component';

type DishData = {
  dish: Dish,
  quantity: number
}

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  dishes: BehaviorSubject<DishData[]> = new BehaviorSubject<DishData[]>([]);
  order: BehaviorSubject<Order> = new BehaviorSubject<Order>({} as Order);

  constructor(private dishService: DishService,
              private orderService: OrderService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.orderService.getActiveOrderSnap(params.userId).onSnapshot(snap => {
        const activeOrder = snap.docs[0] ? snap.docs[0].data() as Order : {
          dishes: {},
          pickup: null,
          rid: null,
          uid: null,
          total: 0,
          active: true,
        } as Order;
        this.order.next(activeOrder);
        const newDishes = [];
        Promise.all(Object.keys(activeOrder.dishes).map(dishId => {
          return this.dishService.getDish(dishId).then(dishData => {
            newDishes.push({ dish: dishData.data(), quantity: activeOrder.dishes[dishId].quantity });
          });
        })).then(() => this.dishes.next(newDishes));
      })
    });
  }

  pay(): void {
    this.orderService.processCart().then(res => {
      this.dialog.open(PaidComponent, {
        width: '250px'
      });
    }).catch(console.error);
  }
}