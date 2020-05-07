import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from 'src/firebase/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Welcome' },
    canActivate: [AuthGuardService]
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'restaurants/:id', component: RestaurantComponent },
  { path: 'cart/:userId', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
