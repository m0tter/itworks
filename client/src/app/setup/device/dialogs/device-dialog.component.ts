import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatTableDataSource, MatTable, MatInput } from '@angular/material';
import { Device, DeviceType, Contract } from '../../../_types';
import { DeviceTypeService } from '../../device-type/device-type.service';
import { OKDialogComponent } from '../../../common/dialogs';
import { ContractSelectDialogComponent } from './contract-select-dialog.component';

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.scss']
})
export class DeviceDialogComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  public device: Device;
  private _new = true;
  public types: DeviceType[];

  @ViewChild(MatTable) table: MatTable<Contract>;
  @ViewChild(MatInput) barcode: MatInput;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<DeviceDialogComponent>,
    private _typeSvc: DeviceTypeService,
    private _dialog: MatDialog,
  ) { _dialogRef.disableClose = true; }

  ngAfterViewInit() {
  }

  ngOnInit() {
    if (this.device) {
      this._new = false;
    } else {
      this.device = new Device();
      this.device.contracts = [];
    }
    this._typeSvc.getTypes().subscribe(
      res => this.types = res,
      err => this.errorHandler(err)
    );
    this.buildForm();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      name: [ this.device.name, Validators.required ],
      serialNumber: [ this.device.serialNumber, Validators.required ],
      barcode: [ this.device.barcode, Validators.required ],
      purchased: this.device.purchaseDate,
      disposed: this.device.disposalDate,
      macLAN: this.device.macWired,
      macWIFI: this.device.macWireless,
      modelId: this.device.modelId,
      spare: this.device.spare
    });
  }

  save() {
    if (this.form.dirty && this.form.valid) {
      const f = this.form.value;
      this.device.barcode = f.barcode;
      this.device.serialNumber = f.serialNumber;
      this.device.name = f.name;
      this.device.purchaseDate = f.purchased;
      this.device.disposalDate = f.disposed;
      this.device.macWired = f.macLAN;
      this.device.macWireless = f.macWIFI;
      this.device.modelId = f.modelId;
      this.device.spare = f.spare;

      this._dialogRef.close(this.device);
    } else {
      alert('whooa there neddy, fill out the form');
    }
  }

  addContract() {
    const d = this._dialog.open(ContractSelectDialogComponent, { width: '320px' });
    d.afterClosed().subscribe(
      res => {
        if (res) {
          this.device.contracts.push(res);
          this.table.renderRows();
          this.form.markAsDirty();
        }
      },
      err => this.errorHandler(err)
    );
  }

  edit(device: Device): void {
    this._new = false;
    this.device = device;
  }

  errorHandler(err: any) {
    console.error(err);
  }

}
