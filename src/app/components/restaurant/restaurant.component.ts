import { Component, OnInit } from "@angular/core";
import { Restaurant, RestaurantService } from 'src/firebase/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DishService } from 'src/firebase/dish.service';

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
    this.route.url.subscribe(url => {
      const id = url[1].path;
      if (id) {
        this.restaurantService.getRestaurant(id)
        .then(currentRestaurant => {
          this.restaurant.next(currentRestaurant.data());
          return currentRestaurant.data();
        }).then(currentRestaurant => {
          let dishes = [];
          currentRestaurant.dishes.forEach(dishRef => {
            dishRef.get().then(dish => dishes.push(dish.data()));
          });
          this.dishes.next(dishes);
        }).catch(err => { throw err; });
      }
    })
  }

}