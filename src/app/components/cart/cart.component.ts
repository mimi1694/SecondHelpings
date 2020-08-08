import { Component, OnInit } from "@angular/core";
import { Order, OrderService } from 'src/firebase/order.service';
import { Dish, DishService } from 'src/firebase/dish.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PaidComponent } from './paid/paid.component';
import { RestaurantService } from 'src/firebase/restaurant.service';
import { FormGroup, FormControl } from '@angular/forms';

type DishData = {
  dish: Dish,
  quantity: FormControl,
  total: number
}

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  availableDays: (d: Date | null) => boolean;
  availableTimeSlots: Array<string> = ["2:00", "2:15"];
  currentOrder: BehaviorSubject<Order> = new BehaviorSubject<Order>({} as Order);
  showForm: boolean = false;
  quantityOptions = [0, 1, 2, 3, 4 ,5, 6, 7, 8, 9, 10];

  dishQuantities: Array<{ [key: string]: FormControl }>

  orderPickupInfo: FormGroup = new FormGroup({
    day: new FormControl(),
    time: new FormControl()
  });

  constructor(private dishService: DishService,
              private orderService: OrderService,
              private restaurantService: RestaurantService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.orderPickupInfo.valueChanges.subscribe(console.warn);
    this.initCalendar();
    this.initForm();
  }

  pay(): void {
    this.orderService.processCart().then(res => {
      this.dialog.open(PaidComponent, {
        width: '250px'
      });
    }).catch(console.error);
  }

  private initForm(): void {
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
        this.currentOrder.next(activeOrder);

        const newDishes = [];
        Promise.all(Object.keys(activeOrder.dishes).map(dishId => {
          return this.dishService.getDish(dishId).then(dishData => {
            newDishes.push({
              dish: dishData.data(),
              quantity: new FormControl(activeOrder.dishes[dishId]),
              total: (dishData.data().price * activeOrder.dishes[dishId])
            });
          });
        })).then(() => {
          this.showForm = !!newDishes.length;
          this.dishQuantities = newDishes;
        });
      })
    });
  }

  private initCalendar(): void {
    this.currentOrder.subscribe(currentOrder => {
      if (currentOrder.rid) {
        this.restaurantService.getRestaurant(currentOrder.rid).then(restaurant => {

          // filter calendar
          this.availableDays = (d: Date | null): boolean => {
            const today = new Date();
            const chosenDay = (d || new Date()).getDay();
            const dayString = this.dayWordFromNum(chosenDay);
            return restaurant.data()[dayString] && d > today;
          };

          // update available time slots:

        });
      }
    });
  }

  private populateAvailableTimes(start: string, end: string): Array<string> {
    return [];
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
