import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './dialog.component.html',
  styles: [`
  .dialog-data {
  text-align: center;

  .data {
    text-align: center;
    margin-block: 0.5rem;
    font-weight: 500;
  }
}
  `]
})
export class DialogComponent {

  public campaignData: any;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.campaignData = data.campaignData;
  }

  @Output() emitter = new EventEmitter<Boolean>();

  sendSignal(flag: boolean) {
    this.emitter.emit(flag);
  }
}
