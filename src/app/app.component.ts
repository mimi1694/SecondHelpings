import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/firebase/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { OrderService, DishCount } from 'src/firebase/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'second-helpings';
  loggedIn: BehaviorSubject<boolean>;
  cartLink: string = "";
  numOrderItems: number = 0;

  constructor(private auth: AuthService, private router: Router, private order: OrderService) { }

  ngOnInit(): void {
    this.loggedIn = this.auth.loggedIn;

    this.auth.authUser.subscribe(authUser => {
      this.cartLink = "/cart/" + authUser.id || "";

      // populate cart badge
      if (authUser.id) {
        this.order.getActiveOrderSnap(authUser.id).onSnapshot(userActiveOrder => {
          this.numOrderItems = 0;
          if (!userActiveOrder.empty) {
            const orderData = userActiveOrder.docs[0].data();
            Object.keys(orderData.dishes).forEach(dishName => {
              this.numOrderItems += orderData.dishes[dishName];
            });
          }
        });
      } else this.numOrderItems = 0; // logout
    });
  }

  logout(): void {
    this.auth.logout();
  }

  navToCart(): void {
    this.router.navigate([this.cartLink]);
  }
}
