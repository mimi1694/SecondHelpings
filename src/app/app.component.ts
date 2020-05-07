import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/firebase/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'second-helpings';
  loggedIn: BehaviorSubject<boolean>;
  cartLink: string = "";

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = this.auth.loggedIn;
    this.auth.authUser.subscribe(authUser => {
      this.cartLink = "/cart/" + authUser.id || "";
    })
  }

  logout(): void {
    this.auth.logout();
  }

  navToCart(): void {
    this.router.navigate([this.cartLink]);
  }
}
