import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Loan, Device, TassStudent } from '../../_types';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { LoanService } from '../loan.service';


@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  public form: FormGroup;
  public loan: Loan;
  private _error = '';
  private _loading = false;
  private _name: string;


  constructor(
    private _loanSvc: LoanService,
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<EditDialogComponent>,
  ) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      barcode: [this.loan.device.barcode, Validators.required],
      start: this.loan.startdate,
      end: this.loan.enddate,
      notes: this.loan.notes,
      lost: this.loan.lost
    });
    this._name = this.loan.user.name;
  }

  delete() {
    if (confirm('Are you sure you want to delete this loan?')) {
      console.log('delete');
    } else {
      console.log('keep it');
    }
  }

  save() {
    if (this.form.dirty && this.form.valid) {
      const f = this.form.value;
      this.loan.startdate = f.start;
      this.loan.deviceBarcode = f.barcode;
      this.loan.notes = f.notes;
      this.loan.lost = f.lost;
      this.loan.enddate = f.end;

      this._dialogRef.close(this.loan);
    }
  }

  errorHandler(error: any) {
    console.log('Error in loan component: ' + error.message || error);
    this._error = error.message || error;
  }
}
