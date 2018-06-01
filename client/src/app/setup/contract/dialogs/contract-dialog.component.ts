import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Vendor, Contract, ContractType } from '../../../_types';
import { VendorService } from '../../vendor/vendor.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractTypeService } from '../../contract-type/contract-type.service';

@Component({
  selector: 'app-contract-dialog',
  templateUrl: './contract-dialog.component.html',
  styles: ['./contract-dialog.component.scss']
})
export class ContractDialogComponent implements OnInit {
  vendors: Vendor[];
  types: ContractType[];
  form: FormGroup;
  contract: Contract;
  private _noExpiry = false;
  private _new = true;

  constructor(
    private _dialogRef: MatDialogRef<ContractDialogComponent>,
    private _vendorSvc: VendorService,
    private _fBuilder: FormBuilder,
    private _ctSvc: ContractTypeService
  ) { }

  ngOnInit() {
    if (this.contract) { this._new = false; } else { this.contract = new Contract(); }
    this._vendorSvc.getVendors().subscribe(
      res => this.vendors = res,
      err => this.errorHandler('error loading vendors.' + err)
    );
    this._ctSvc.getTypes().subscribe(
      res => this.types = res,
      err => this.errorHandler('error loading contract types. ' + err)
    );
    this.buildForm();
  }

  buildForm() {
    this.form = this._fBuilder.group({
      name: [this.contract.name, Validators.required],
      notes: this.contract.notes,
      vendorId: [this.contract.vendorId, Validators.required],
      typeId: this.contract.typeId,
      start: this.contract.start || new Date(),
      end: this.contract.expiry,
      noExpiry: this._noExpiry
    });
  }

  noExpiry(ev: any) {
    // this is a not because the value is not updated until after the evaluation
    // it won't make any sense next time you look at it

    if (!this.form.get('noExpiry').value) {
      this.form.get('end').disable();
    } else {
      this.form.get('end').enable();
    }
  }

  public closeDialog() {
    this._dialogRef.close();
  }

  okDialog() {
    if (this.form.dirty && this.form.valid) {
      const f = this.form.value;
      this.contract.name = f.name;
      this.contract.notes = f.notes;
      this.contract.vendorId = f.vendorId;
      this.contract.typeId = f.typeId;
      this.contract.start = f.start;
      this.contract.expiry = f.end;
      if (f.typeId) { this.contract.type = this.types.find(e => e.id === f.typeId); }
      if (f.vendorId) { this.contract.vendor = this.vendors.find(e => e.id === f.vendorId); }

      this._dialogRef.close(this.contract);
    } else {
      alert('form not valid');
    }
  }

  errorHandler(msg: string) {
    throw new Error(msg);
  }
}
