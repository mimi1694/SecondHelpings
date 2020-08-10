import { Component, OnInit } from "@angular/core";
import { Order, OrderService } from 'src/firebase/order.service';
import { Dish, DishService } from 'src/firebase/dish.service';
import { ActivatedRoute } from '@angular/router';
import { take, distinctUntilKeyChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PaidComponent } from './paid/paid.component';
import { RestaurantService, Restaurant } from 'src/firebase/restaurant.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

type DishData = {
  dish: Dish,
  quantity: number,
  total: number
}

type FullOrderInfo = {
  dishes: DishData[],
  pickup: number,
  rid: string,
  uid: string,
  total: number,
  id?: string,
  active: boolean
};

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  quantityOptions = [0, 1, 2, 3, 4 ,5, 6, 7, 8, 9, 10];
  showForm: boolean = false;

  availableDays: (d: Date | null) => boolean;
  availableTimeSlots: Array<string> = [];

  currentOrder: BehaviorSubject<FullOrderInfo> = new BehaviorSubject<FullOrderInfo>({} as FullOrderInfo);

  // forms for the order info
  orderDishInfo: FormArray = new FormArray([]);
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
    this.initCalendar();
    this.initForm();
  }

  pay(): void {
    this.orderDishInfo.reset();
    this.orderPickupInfo.reset();
    this.orderService.processCart().then(res => {
      this.dialog.open(PaidComponent, {
        width: '350px'
      });
    }).catch(console.error);
  }

  private initForm(): void {
    // populate the forms and current order data
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.orderService.getActiveOrderSnap(params.userId).onSnapshot(snap => {
        const activeOrder = snap.docs[0] ? snap.docs[0].data() as Order : {
          dishes: {},
          pickup: null,
          rid: null,
          uid: null,
          total: 0,
          active: true,
        } as FullOrderInfo;
        const activeOrderDishes: DishData[] = [];

        Promise.all(Object.keys(activeOrder.dishes).map(dishId => {
          return this.dishService.getDish(dishId).then(dishData => {
            activeOrderDishes.push({
              dish: dishData,
              quantity: activeOrder.dishes[dishId],
              total: (dishData.price * activeOrder.dishes[dishId])
            });
            this.orderDishInfo.push(new FormControl(activeOrder.dishes[dishId], { updateOn: "change" }));
          });
        })).then(() => {
          this.showForm = !!activeOrderDishes.length;
          activeOrder.dishes = activeOrderDishes;
          this.currentOrder.next(activeOrder as FullOrderInfo);
        });
      })
    });

    // every time the dish quantities update, update the current order
    this.orderDishInfo.valueChanges.subscribe(dishQuantities => {
      const updatedOrderInfo = this.currentOrder.getValue();
      if (updatedOrderInfo.dishes && updatedOrderInfo.dishes.length) {
        dishQuantities.forEach((num, i) => {
          updatedOrderInfo.dishes[i].quantity = num;
          updatedOrderInfo.dishes[i].total = num * (updatedOrderInfo.dishes[i].dish.price);
        });
        updatedOrderInfo.total = updatedOrderInfo.dishes.map(dish => dish.total).reduce((x, y) => x + y);
        this.currentOrder.next(updatedOrderInfo);
      }
    });
  }

  private initCalendar(): void {
    this.currentOrder.pipe(distinctUntilKeyChanged("rid")).subscribe(currentOrder => {
      if (currentOrder.rid) {
        this.restaurantService.getRestaurant(currentOrder.rid).then(restaurant => {

          // filter calendar
          this.availableDays = (d: Date | null): boolean => {
            const today = new Date();
            const chosenDay = (d || new Date()).getDay();
            const dayString = this.dayWordFromNum(chosenDay);
            return restaurant[dayString] && d > today;
          };

          // update available time slots:
          this.availableTimeSlots = this.populateAvailableTimes(restaurant);
        });
      }
    });
  }

  private populateAvailableTimes(restaurant: Restaurant): Array<string> {
    let currentTimeSlot = new Date();
    currentTimeSlot.setHours(parseInt(restaurant.start.split(":")[0]));
    currentTimeSlot.setMinutes(parseInt(restaurant.start.split(":")[1]));
    const endTime = new Date();
    endTime.setHours(parseInt(restaurant.end.split(":")[0]));
    endTime.setMinutes(parseInt(restaurant.end.split(":")[1]));
    const times: Date[] = [currentTimeSlot];
    
    while (times[times.length - 1] < endTime) {
      const newTime = new Date(currentTimeSlot);
      newTime.setTime(currentTimeSlot.getTime() + (60000 * restaurant.slotsIncrement));
      times.push(newTime);
      currentTimeSlot = newTime;
    }

    return times.map(time => {
      const hours = time.getHours() % 12 ? time.getHours() % 12 : 12;
      const min = (!time.getMinutes() ? "00" : time.getMinutes());
      const suffix = time.getHours() < 12 ? "AM" : "PM";
      return hours + ":" + min + " " + suffix;
    });
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
