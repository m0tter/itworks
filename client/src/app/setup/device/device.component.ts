import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MatPaginator, MatTable, MatTab, MatInput } from '@angular/material';
import { DeviceService } from './device.service';
import { SetupService } from '../setup.service';
import { Device } from '../../_types';
import { Observable } from 'rxjs/Observable';
import { DeviceDialogComponent } from './dialogs/device-dialog.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit, AfterViewInit {
  _error = '';
  _loading = false;
  _data: MatTableDataSource<Device>;
  _editDisabled = true;
  _deleteDisabled = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<Device>;

  constructor(
    private _deviceSvc: DeviceService,
    private _setupSvc: SetupService,
    private _dialog: MatDialog
  ) { }

  newDevice() {
    const dialogRef = this._dialog.open(DeviceDialogComponent,
      {
        width: '620px',
        panelClass: 'device-dialog'
      });
    dialogRef.afterClosed().subscribe(result => {
      const device = <Device>result;
      if (device) {
        this._deviceSvc.newDevice(device)
          .subscribe(
            savedDevice => this.displayDevice(savedDevice),
            err => this.errorHandler(err)
          );
      }
    });
  }

  displayDevice(d: Device) {
    this._data.data.push(d);
    this.table.renderRows();
    this.paginator.firstPage();
    this.paginator.lastPage();
  }

  selectRow(row: any) {
    row.selected = !row.selected;
    this.checkButtons();
  }

  applyFilter(filter: string) {
    filter = filter.trim();
    filter = filter.toLowerCase();
    this._data.filter = filter;
  }

  checkButtons() {
    let count = 0;
    for (const v of this._data.data) {
      if (v.selected) { count++; }
    }
    if (count !== 1) { this._editDisabled = true; } else { this._editDisabled = false; }
    if (count > 0) { this._deleteDisabled = false; } else { this._deleteDisabled = true; }
  }

  editRow(row: Device) {
    this.editDevice(row);
  }

  editDevice(device?: Device) {
    const d = device || this._data.data.find(e => e.selected);
    if (d) {
      const dialogRef = this._dialog.open(DeviceDialogComponent,
      {
        width: '620px',
        panelClass: 'device-dialog'
      });
      const devCopy = Object.assign({}, d);
      dialogRef.componentInstance.edit(devCopy);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._deviceSvc.editDevice(result)
            .subscribe(
              res => {
                if (res) {
                  result.selected = false;
                  // const a = this._data.data;
                  this._data.data.splice(this._data.data.indexOf(d), 1, result);
                  this.table.renderRows();
                  this.checkButtons();
                } else { this.errorHandler('The device was not updated, please see server logs'); }
              },
              err => this.errorHandler(err)
            );
        }
      });
    }
  }

  deleteDevice() {
    for (const d of this._data.data) {
      if (d.selected) {
        this._deviceSvc.deleteDevice(d.id)
          .subscribe(
            res => {
              const a = this._data.data;
              a.splice(this._data.data.indexOf(d), 1);
              this._data.data = a;
              this.checkButtons();
            },
            err => this.errorHandler(err)
        );
      }
    }
  }

  ngOnInit() {
    this._setupSvc.showNav();
    this._loading = true;
    this._deviceSvc.getDevices()
      .subscribe(
        res => this._data = new MatTableDataSource<Device>(res),
        err => this.errorHandler(err),
        () => { this._loading = false; this._data.paginator = this.paginator; }
      );
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  errorHandler(error: any) {
    console.log('Error in device component: ' + error.message || error);
    this._error = error.message || error;
  }


}
