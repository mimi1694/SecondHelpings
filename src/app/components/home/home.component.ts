import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Restaurant, RestaurantService } from 'src/firebase/restaurant.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurants: BehaviorSubject<Array<Restaurant>> = new BehaviorSubject([]);

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().onSnapshot(restaurants => {
     const currentRests = [];
     restaurants.docs.forEach(resto => currentRests.push(resto.data() as Restaurant));
     this.restaurants.next(currentRests);
    });
  }
}