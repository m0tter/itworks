import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractType } from '../../_types';
import { ContractTypeService } from './contract-type.service';
import { SetupService } from '../setup.service';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { ContractTypeDialogComponent } from './dialogs/contract-type-dialog.component';
import { YesNoDialogComponent, OKDialogComponent } from '../../common/dialogs';


@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.scss']
})
export class ContractTypeComponent implements OnInit {
  private _types: MatTableDataSource<ContractType>;
  private _loading = true;
  private _error = '';
  private _editDisabled = true;
  private _deleteDisabled = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _ctSvc: ContractTypeService,
    private _setupSvc: SetupService,
    private _matDialog: MatDialog
  ) { }

  getTypes() {
    this._ctSvc.getTypes().subscribe(
      res => this._types = new MatTableDataSource<ContractType>(res),
      err => this.errorHandler(err),
      () => {
        this._loading = false;
        this._types.paginator = this.paginator;
      }
    );
  }

  newType() {
    const dialogRef = this._matDialog.open(ContractTypeDialogComponent,
      {
        width: '400px',
        panelClass: 'formFieldWidth350'
      });
    dialogRef.afterClosed().subscribe(result => {
      const ct = <ContractType>result;
      if (ct) {
        this._ctSvc.newContractType(ct)
          .subscribe(
            saved => this.addContractType(saved),
            err => this.errorHandler(err)
          );
      }
    });
  }

  deleteType() {
    for (const ct of this._types.data){
      if (ct.selected) {
        const dialog = this._matDialog.open(YesNoDialogComponent,
        {
          data: `Are you sure you want to delete ${ct.type} contract type?`,
          width: '350px'
        });
        dialog.afterClosed().subscribe(
          dialogResult => {
            if (dialogResult && true) {
              this._ctSvc.deleteContractType(ct.id)
                .subscribe(
                  res => this.removeContractType(ct),
                  err => {
                    if (err.message === 'existing') {
                      this.displayOKDialog('The selected contract type is still in use and cannot be deleted');
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

  editType() {
    const ct = this._types.data.find(e => e.selected);
    if (ct) {
      const dialog = this._matDialog.open(ContractTypeDialogComponent,
        {
          width: '400px',
          panelClass: 'formFieldWidth350'
        });
      const ctCopy = Object.assign({}, ct);
      dialog.componentInstance.contractType = ctCopy;

      dialog.afterClosed().subscribe(result => {
        if (result) {
          this._ctSvc.editContractType(result)
            .subscribe(
              httpResult => this.updateContractType(ct, ctCopy),
              err => this.errorHandler(err)
            );
        }
      });
    }
  }

  displayOKDialog(msg: string) {
    const okDialog = this._matDialog.open(OKDialogComponent, {
      data: msg, width: '350px' });
  }

  addContractType(ct: ContractType) {
    const a = this._types.data;
    a.push(ct);
    this._types.data = a;
    this.checkButtons();
  }

  updateContractType(old: ContractType, update: ContractType) {
    const a = this._types.data;
    a.splice(a.indexOf(old), 1, update);
    this._types.data = a;
    update.selected = false;
    this.checkButtons();
  }

  removeContractType(ct: ContractType) {
    const a = this._types.data;
    a.splice(a.indexOf(ct), 1);
    this._types.data = a;
    this.checkButtons();
  }

  selectRow(row: any) {
    row.selected = !row.selected;
    this.checkButtons();
  }

  checkButtons() {
    let count = 0;
    for (const v of this._types.data) {
      if (v.selected) { count++; }
    }
    if (count !== 1) { this._editDisabled = true; } else { this._editDisabled = false; }
    if (count > 0) { this._deleteDisabled = false; } else { this._deleteDisabled = true; }
  }

  errorHandler(err: any) {
    console.error('An error occurred in contract-type.component. ' + err.message || err);
    this._error = err.message || err;
  }

  ngOnInit() {
    this._setupSvc.showNav();
    this.getTypes();

  }

}
