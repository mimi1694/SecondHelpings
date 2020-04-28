import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderAddComponent } from './order-add/order-add.component';
import { OrderEditComponent } from './order-edit/order-edit.component';

const routes: Routes = [
  {
    path: 'orders',
    component: OrderComponent,
    data: { title: 'Order List' }
  },
  {
    path: 'order-details/:id',
    component: OrderDetailComponent,
    data: { title: 'Order Details' }
  },
  {
    path: 'order-add',
    component: OrderAddComponent,
    data: { title: 'Order Add' }
  },
  {
    path: 'order-edit/:id',
    component: OrderEditComponent,
    data: { title: 'Order Edit' }
  },
  { path: '',
    redirectTo: '/orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
