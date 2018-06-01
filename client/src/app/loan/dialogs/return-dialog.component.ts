import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';
import { Loan, Device, TassStudent, TassStaff, IUser } from '../../_types';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { LoanService } from '../loan.service';
import { UserService } from '../../services/user.service';
import { DeviceService } from '../../setup/device/device.service';

@Component({
  selector: 'app-loan-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.scss']
})
export class ReturnDialogComponent implements OnInit {
  public form: FormGroup;
  public userCtrl: FormControl = new FormControl();
  public loan: Loan;
  private _error: any;
  private _name: string;
  private _now = new Date();

  constructor(
    private _loanSvc: LoanService,
    private _dialogRef: MatDialogRef<ReturnDialogComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      barcode: this.loan.device.barcode,
      name: this.loan.user.name,
      end: this.loan.enddate,
      notes: this.loan.notes
    });
    this._name = this.loan.user.name;
  }

  save() {
    if (this.form.valid) {
      const f = this.form.value;
      this.loan.enddate = f.end;
      this.loan.notes = f.notes;

      this._dialogRef.close(this.loan);
    }
  }

  errorHandler(error: any) {
    console.log('Error in return loan component: ' + error.message || error);
    this._error = error.message || error;
  }
}
