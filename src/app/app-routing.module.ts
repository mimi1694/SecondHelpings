import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryComponent } from './components/entry/entry.component';

const routes: Routes = [
  {
    path: 'login',
    component: EntryComponent,
    data: { title: 'Sign In' }
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
