import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Vendor } from '../../../_types';

@Component({
  selector: 'app-vendor-dialog',
  templateUrl: './vendor-dialog.component.html',
  styleUrls: ['./vendor-dialog.component.scss']
})
export class VendorDialogComponent implements OnInit {
  public vendorForm: FormGroup;
  public vendor: Vendor;
  private _newVendor = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<VendorDialogComponent>
  ) { }

  ngOnInit() {
    if (this.vendor) { this._newVendor = false; } else { this.vendor = new Vendor(); }
    this.buildForm();
  }

  buildForm() {
    this.vendorForm = this._formBuilder.group({
      name: [this.vendor.name, Validators.required],
      address1: this.vendor.address1,
      address2: this.vendor.address2,
      suburb: this.vendor.suburb,
      state: this.vendor.state
    });
  }

  save() {
    if (this.vendorForm.dirty && this.vendorForm.valid) {
      const f = this.vendorForm.value;
      this.vendor.name = f.name;
      this.vendor.address1 = f.address1;
      this.vendor.address2 = f.address2;
      this.vendor.suburb = f.suburb;
      this.vendor.state = f.state;

      this._dialogRef.close(this.vendor);
    }
  }

  editVendor(vendor: Vendor): void {
    this._newVendor = false;
    this.vendor = vendor;
  }

}
