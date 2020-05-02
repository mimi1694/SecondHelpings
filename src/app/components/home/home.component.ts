import { Component } from "@angular/core";
import { AuthService } from 'src/firebase/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}