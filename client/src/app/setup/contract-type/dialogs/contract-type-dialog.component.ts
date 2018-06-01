import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ContractType } from '../../../_types';

@Component({
  selector: 'app-contract-type-dialog',
  template: `
    <div mat-dialog-title>Contract Type</div>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <input matInput [(ngModel)]="contractType.type" placeholder="Type">
      </mat-form-field>
    </div>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <textarea matInput [(ngModel)]="contractType.description" placeholder="Description"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="okDialog()">OK</button>
        <button mat-raised-button color="default" (click)="closeDialog()">Cancel</button>
    </div>
  `,
  styles: ['``']
})
export class ContractTypeDialogComponent implements OnInit {
  contractType: ContractType;

  constructor(private _dialogRef: MatDialogRef<ContractTypeDialogComponent>) { }

  public closeDialog() {
    this._dialogRef.close();
  }

  okDialog() {
    this._dialogRef.close(this.contractType);
  }

  ngOnInit() {
    if (!this.contractType) { this.contractType = new ContractType(); }
  }
}
