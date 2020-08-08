import { Component, OnInit } from "@angular/core";
import { Order, OrderService } from 'src/firebase/order.service';
import { Dish, DishService } from 'src/firebase/dish.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PaidComponent } from './paid/paid.component';
import { RestaurantService } from 'src/firebase/restaurant.service';

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
  availableTimes: (d: Date | null) => boolean;

  constructor(private dishService: DishService,
              private orderService: OrderService,
              private restaurantService: RestaurantService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initCalendar();
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
        console.warn(activeOrder);
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

  private initCalendar(): void {
    this.order.subscribe(currentOrder => {
      if (currentOrder.rid) {
        this.restaurantService.getRestaurant(currentOrder.rid).then(restaurant => {
          this.availableTimes = (d: Date | null): boolean => {
            const todayNum = (d || new Date()).getDay();
            const todayWord = this.dayWordFromNum(todayNum);
            return restaurant.data()[todayWord];
          };
        });
      }
    });
  }

  private dayNumFromWord(day: string): number {
    switch(day) {
      case "sun": return 0;
      case "mon": return 1;
      case "tues": return 2;
      case "wed": return 3;
      case "thurs": return 4;
      case "fri": return 5;
      case "sat": return 6;
      default: return -1;
    }
  }

  private dayWordFromNum(day: number): string {
    switch(day) {
      case 0: return "sun";
      case 1: return "mon";
      case 2: return "tues";
      case 3: return "wed";
      case 4: return "thurs";
      case 5: return "fri";
      case 6: return "sat";
      default: return "";
    }
  }
}