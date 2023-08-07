import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snak-bar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule],
  template: "<span matSnackBar Label > {{ message }}</span>",
  styles: [
    `:host {
      display: flex;
    }`],
})
export class SnakBarComponent {
  public message: string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
    this.message = data;
  }

}
