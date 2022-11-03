import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-popup-model',
  templateUrl: './popup-model.component.html',
  styleUrls: ['./popup-model.component.scss']
})
export class PopupModelComponent implements OnInit {

   defaultSelected = 0
   @Input() selection: string= 'Full Day';


  constructor(
    public dialogRef: MatDialogRef<PopupModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
