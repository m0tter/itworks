import { Component, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-ok-dialog',
  template: `
    <div mat-dialog-title>ITWorks</div>
    <div mat-dialog-content class="content">{{data}}</div>
    <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="_dialogRef.close()">OK</button>
    </div>
  `,
  styles: []
})
export class OKDialogComponent {
  constructor(private _dialogRef: MatDialogRef<OKDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  public closeDialog() {
    this._dialogRef.close(false);
  }
}
