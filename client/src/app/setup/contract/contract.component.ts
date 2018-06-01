import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from './contract.service';
import { Contract } from '../../_types';
import { SetupService } from '../setup.service';
import { ContractDialogComponent } from './dialogs/contract-dialog.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatDialogRef } from '@angular/material';
import { OKDialogComponent, YesNoDialogComponent } from '../../common/dialogs';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  _contracts: MatTableDataSource<Contract>;
  _error = '';
  _loading = false;
  _editDisabled = true;
  _deleteDisabled = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor (
    private _contractSvc: ContractService,
    private _setupSvc: SetupService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this._loading = true;
    this._setupSvc.showNav();
    this._contractSvc.getContracts()
      .subscribe(
        res => this._contracts = new MatTableDataSource<Contract>(res),
        err => this.errorHandler(err),
        () => this._loading = false
      );
   }

  btnNewClicked() { this.newContract(); }
  btnDeleteClicked() { this.deleteSelected(); }
  btnEditClicked() { this.editContract(); }

  newContract() {
    const dialogRef = this._dialog.open(ContractDialogComponent,
      {
        width: '425px'
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      const contract = <Contract>result;
      if (contract) {
        this._contractSvc.newContract(contract)
        .subscribe(
          saved => this.addContract(saved),
          err => this.errorHandler(err)
        );
      }
    });
  }

  editContract() {
    const ct = this._contracts.data.find(e => e.selected);
    if (ct) {
      const dialog = this._dialog.open(ContractDialogComponent,
        {
          width: '425px'
        });
      const ctCopy = Object.assign({}, ct);
      dialog.componentInstance.contract = ctCopy;

      dialog.afterClosed().subscribe(result => {
        if (result) {
          this._contractSvc.editContract(result)
            .subscribe(
              httpResult => this.updateContract(ct, ctCopy),
              err => this.errorHandler(err)
            );
        }
      });
    }
  }

  deleteSelected() {
    for (const ct of this._contracts.data) {
      if (ct.selected) {
        const dialog = this._dialog.open(YesNoDialogComponent,
        {
          data: `Are you sure you want to delete ${ct.name}? Contracts should not be deleted.`,
          width: '350px'
        });
        dialog.afterClosed().subscribe(
          dialogResult => {
            if (dialogResult && true) {
              this._contractSvc.deleteContract(ct.id)
                .subscribe(
                  res => this.removeContract(ct),
                  err => {
                    if (err.message === 'existing') {
                      this.displayOKDialog('The selected contract is still assigned to devices and can not be deleted');
                    } else {
                      this.errorHandler(err);
                    }
                  }
                );
            }
          }
        );
      }
    }
  }

  removeContract(ct: Contract) {
    const a = this._contracts.data;
    a.splice(a.indexOf(ct), 1);
    this._contracts.data = a;
    this.checkButtons();
  }

  addContract(c: Contract) {
    const a = this._contracts.data;
    a.push(c);
    this._contracts.data = a;
  }

  updateContract(old: Contract, update: Contract) {
    const a = this._contracts.data;
    a.splice(a.indexOf(old), 1, update);
    this._contracts.data = a;
    update.selected = false;
    this.checkButtons();
  }

  selectRow(row: any) {
    row.selected = !row.selected;
    this.checkButtons();
  }

  checkButtons() {
    let count = 0;
    for (const v of this._contracts.data) {
      if (v.selected) { count++; }
    }
    if (count !== 1) { this._editDisabled = true; } else { this._editDisabled = false; }
    if (count > 0) { this._deleteDisabled = false; } else { this._deleteDisabled = true; }
  }

   displayOKDialog(msg: string) {
    const okDialog = this._dialog.open(OKDialogComponent, {
      data: msg, width: '350px' });
  }

  errorHandler(error: any) {
    this._error = error.message || error;
  }
}
