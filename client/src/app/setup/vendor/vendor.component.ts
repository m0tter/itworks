import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { VendorService } from './vendor.service';
import { SetupService } from '../setup.service';
import { Vendor, TableDataSource } from '../../_types';
import { VendorDialogComponent } from './dialogs/vendor-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  _error = '';
  _loading = false;
  _data: MatTableDataSource<Vendor>;
  _editDisabled = true;
  _deleteDisabled = true;

  constructor (
    private _vendorSvc: VendorService,
    private _setupSvc: SetupService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this._setupSvc.showNav();
    this._loading = true;
    this._vendorSvc.getVendors()
      .subscribe(
        res => { this._data = new MatTableDataSource<Vendor>(res); },
        err => this.errorHandler(err),
        () => { this._loading = false; },
      );
  }

  applyFilter(filter: string) {
    filter = filter.trim();
    filter = filter.toLowerCase();
    this._data.filter = filter;
   }

  newVendor() {
    const dialogRef = this._dialog.open(VendorDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      const vendor = <Vendor>result;
      if (vendor) {
        this._vendorSvc.newVendor(vendor)
          .subscribe(
            savedVendor => this.displayVendor(savedVendor),
            err => this.errorHandler(err)
          );
      }
    });
  }

  displayVendor(v: Vendor) {
    const a = this._data.data;
    a.push(v);
    this._data.data = a;
  }

  deleteVendor() {
    for (const v of this._data.data) {
      if (v.selected) {
        this._vendorSvc.deleteVendor(v.id)
          .subscribe(
            res => {
              const a = this._data.data;
              a.splice(this._data.data.indexOf(v), 1);
              this._data.data = a;
            },
            err => this.errorHandler(err)
          );
      }
    }
  }

  editVendor() {
    const v = this._data.data.find(e => e.selected);
    if (v) {
      const dialogRef = this._dialog.open(VendorDialogComponent);
      const vcopy = <Vendor>JSON.parse(JSON.stringify(v));
      dialogRef.componentInstance.editVendor(vcopy);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._vendorSvc.editVendor(result)
            .subscribe(
              res => {
                if (res) {
                const a = this._data.data;
                a.splice(this._data.data.indexOf(v), 1, result);
                this._data.data = a;
                } else { this.errorHandler('The vendor was not updated, please see server logs'); }
              },
              err => this.errorHandler(err)
            );
        }
      });
    }
  }

  selectRow(row: any) {
    row.selected = !row.selected;
    this.checkButtons();
  }

  checkButtons() {
    let count = 0;
    for (const v of this._data.data) {
      if (v.selected) { count++; }
    }
    if (count !== 1) { this._editDisabled = true; } else { this._editDisabled = false; }
    if (count > 0) { this._deleteDisabled = false; } else { this._deleteDisabled = true; }
  }

  errorHandler(error: any) {
    console.log('Error in vendor: ' + error.message || error);
    this._error = error.message || error;
  }
}
