import { Component, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-yesno-dialog',
  templateUrl: 'yesno-dialog.component.html',
  styleUrls: ['yesno-dialog.component.scss']
})
export class YesNoDialogComponent {
  constructor(private _dialogRef: MatDialogRef<YesNoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  public yes() { this._dialogRef.close(true); }
  public no() { this._dialogRef.close(false); }

  public closeDialog() {
    this._dialogRef.close(false);
  }
}
