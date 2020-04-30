import { Component } from "@angular/core";
import { AuthService } from 'src/firebase/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public auth: AuthService) {
  }

}