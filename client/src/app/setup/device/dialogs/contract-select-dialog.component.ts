import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Contract } from '../../../_types';
import { ContractService } from '../../contract/contract.service';

@Component({
  selector: 'app-contract-select-dialog',
  template: `
    <div mat-dialog-title>Select Contract</div>
    <div mat-dialog-content class="content">
      <mat-select placeholder="Contract" [(ngModel)]="_contract">
        <mat-option *ngFor="let c of _contracts" [value]="c">{{c.name}}</mat-option>
      </mat-select>
    </div>
    <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="select()">Select</button>
        <button mat-button (click)="close()">Cancel</button>
    </div>
  `,
  styles: ['.content{padding:10px 25px;}']
})
export class ContractSelectDialogComponent implements OnInit {
  private _contracts: Contract[];
  private _loading = true;
  private _contract: Contract;

  constructor(
    private _dialogRef: MatDialogRef<ContractSelectDialogComponent>,
    private _contractSvc: ContractService
  ) { _dialogRef.disableClose = true; }

  public close() {
    this._dialogRef.close();
  }

  public select() {
    this._dialogRef.close(this._contract);
  }

  ngOnInit() {
    this._contractSvc.getContracts()
      .subscribe(
        res => this._contracts = res,
        err => alert(err.message),
        () => this._loading = false
      );
  }
}
