import { Component } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.css']
})
export class PaidComponent {
  restaurant: string = "";
  time: string = "";

  constructor(public dialogRef: MatDialogRef<PaidComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}