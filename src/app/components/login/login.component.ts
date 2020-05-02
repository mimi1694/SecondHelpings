import { Component } from "@angular/core";
import { AuthService } from 'src/firebase/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: AuthService) { }

  googleLogin(type: 'user' | 'restaurant'): void {
    this.auth.loginWithGoogle(type);
  }

}