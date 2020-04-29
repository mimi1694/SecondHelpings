import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orders:any = [];

  constructor() { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orders = [];
    // this.rest.getOrders().subscribe((data: {}) => {
    //   console.log(data);
    //   this.orders = data;
    // });
  }

  add() {
    // this.router.navigate(['/order-add']);
  }

  delete(id) {
    // this.rest.deleteOrder(id)
    //   .subscribe(res => {
    //       this.getOrders();
    //     }, (err) => {
    //       console.log(err);
    //     }
    //   );
  }

}