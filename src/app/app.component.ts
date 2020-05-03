import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/firebase/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'second-helpings';
  loggedIn: BehaviorSubject<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.loggedIn = this.auth.loggedIn;
  }

  logout(): void {
    this.auth.logout();
  }
}
