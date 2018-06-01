import { Component, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-device-type-dialog',
  template: `
    <div mat-dialog-title>Device Type</div>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <input matInput [(ngModel)]="typeName" placeholder="Device Type">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="okDialog()">OK</button>
        <button mat-raised-button color="default" (click)="closeDialog()">Cancel</button>
    </div>
  `,
  styles: []
})
export class DeviceTypeDialogComponent {
  typeName: string;

  constructor(private _dialogRef: MatDialogRef<DeviceTypeDialogComponent>) { }

  public closeDialog() {
    this._dialogRef.close();
  }

  okDialog() {
    this._dialogRef.close(this.typeName);
  }
}
