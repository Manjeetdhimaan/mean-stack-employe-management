import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { slideUp } from 'src/app/shared/common/animations/animations';

@Component({
  selector: 'app-discard-changes',
  templateUrl: './discard-changes.component.html',
  styleUrls: ['./discard-changes.component.scss'],
  animations: [slideUp]
})
export class DiscardChangesComponent {

  @Input() cancelText: string;
  @Input() confirmText: string;
  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DiscardChangesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  } // Closing dialog window

  public cancel(): void { // To cancel the dialog window
    this.dialogRef.close();
  }

  public cancelN(event: any): void {

    event !== 'logout' ? this.dialog.closeAll() : false;

  }

}