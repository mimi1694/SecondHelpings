import { Component, Input, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.css']
})
export class PaidComponent {
  restaurant: string = "";
  day: string = "";
  time: string = "";

  constructor(public dialogRef: MatDialogRef<PaidComponent>, @Inject(MAT_DIALOG_DATA) data) {
    const pickup = new Date(data.time);
    this.restaurant = data.restaurant;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}