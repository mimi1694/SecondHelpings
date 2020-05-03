import { Component, OnInit } from "@angular/core";
import { Restaurant, RestaurantService } from 'src/firebase/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DishService } from 'src/firebase/dish.service';

const debug = true;

@Component({
  selector: 'restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurant: BehaviorSubject<Restaurant> = new BehaviorSubject({} as Restaurant);
  dishes: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute, private dishService: DishService) { }

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

}