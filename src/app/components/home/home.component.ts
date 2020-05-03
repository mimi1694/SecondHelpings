import { Component, OnInit } from "@angular/core";
import { Restaurant, RestaurantService } from 'src/firebase/restaurant.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurants: BehaviorSubject<Array<Restaurant>> = new BehaviorSubject([]);

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().onSnapshot(restaurants => {
      const currentRests = [];
      restaurants.docs.forEach(resto => currentRests.push(resto.data() as Restaurant));
      this.restaurants.next(currentRests);
    });
  }

  goToRestaurantPage(rest: Restaurant): void {
    this.router.navigate([`restaurants/${rest.id}`]);
  }
}