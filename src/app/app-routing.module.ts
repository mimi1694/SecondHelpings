import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from 'src/firebase/auth-guard.service';

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
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
