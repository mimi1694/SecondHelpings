import { Component, OnInit } from "@angular/core";
import { Restaurant, RestaurantService } from 'src/firebase/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DishService, Dish } from 'src/firebase/dish.service';
import { OrderService, Order, OrderError } from 'src/firebase/order.service';
import { AuthService } from 'src/firebase/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';

const debug = true;

@Component({
  selector: 'restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurant: BehaviorSubject<Restaurant> = new BehaviorSubject({} as Restaurant);
  dishes: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  map;

  constructor(private restaurantService: RestaurantService,
              private route: ActivatedRoute,
              private dishService: DishService,
              private cartService: OrderService,
              private authService: AuthService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.url.pipe(take(1)).subscribe(url => {
      const id = url[1].path;
      if (id) {

        this.restaurantService.getRestaurants().onSnapshot(snapshot => {
          const currentRestaurant = snapshot.docs.find(rest => rest.data().id === id);
          if (currentRestaurant) {
            this.restaurant.next(currentRestaurant.data() as Restaurant);
            debug && console.warn("Current Restaurant", this.restaurant.getValue());
          } else {
            this.restaurant.next({} as Restaurant);
          }
        });
        this.dishService.getDishes().where('rid', '==', id).onSnapshot(snapshot => {
          const dishes = snapshot.docs.map(dishDoc => dishDoc.data());
          this.dishes.next(dishes);
          debug && console.warn("Current Dishes", this.dishes.getValue());
        });

      }
    });
  }

  addToCart(dish: Dish): void {
    // console.warn("Adding ", dish.name, dish, this.authService.authUser.id);
    this.cartService.addToOrder(dish)
    .then(res => console.warn("finished adding", res))
    .catch(err => {
      // console.error(err);
      // TODO check error type
      let dialogRef = this.dialog.open(OrderDialogComponent, {
        width: '250px',
        data: { dish }
      });
  
      dialogRef.afterClosed().subscribe((replace: boolean) => {
        console.log('The dialog was closed', replace);
        if (replace) {
          this.cartService.addToOrder(dish, true);
        }
      });
    });
  }
}