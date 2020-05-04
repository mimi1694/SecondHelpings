import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { Dish } from 'src/firebase/dish.service';

@Component({
  selector: 'order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css']
})
export class OrderDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dish: Dish },
    public dialogRef: MatDialogRef<OrderDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  replaceOrder() {
    this.dialogRef.close(true)
  }
}