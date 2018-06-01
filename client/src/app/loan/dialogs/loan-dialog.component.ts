import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';
import { Loan, Device, TassStudent, TassStaff, IUser, User } from '../../_types';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { LoanService } from '../loan.service';
import { UserService } from '../../services/user.service';
import { DeviceService } from '../../setup/device/device.service';
import { plainToClass } from 'class-transformer';

// class User implements IUser {

// }

@Component({
  selector: 'app-loan-dialog',
  templateUrl: './loan-dialog.component.html',
  styleUrls: ['./loan-dialog.component.scss']
})
export class LoanDialogComponent implements OnInit {
  public form: FormGroup;
  public userCtrl: FormControl = new FormControl();
  public loan: Loan = new Loan();
  private _new = true;
  private _users: User[] = [];
  private _students: TassStudent[] = [];
  private _staff: TassStaff[] = [];
  private _error = '';
  private _loading = false;
  filteredUsers: Observable<IUser[]>;

  constructor(
    private _loanSvc: LoanService,
    private _userSvc: UserService,
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<LoanDialogComponent>,
    private _deviceSvc: DeviceService
  ) { }

  ngOnInit() {
    this.loan.device = new Device();
    this.loan.startdate = new Date();
    this.form = this._formBuilder.group({
      barcode: [this.loan.device.barcode, Validators.required],
      start: this.loan.startdate
    });

    this._userSvc.getStudents()
      .subscribe(
        res => {
          res.forEach(e => {
            this._users.push(new User().deserialize(e));
          });
        },
        err => this.errorHandler(err),
        () => this._loading = false
      );

    this._userSvc.getStaff()
      .subscribe(
        res => {
          res.forEach(e => {
            this._users.push(new User().deserialize(e));
          });
        },
        err => this.errorHandler(err),
        () => this._loading = false
      );

    this.filteredUsers = this.userCtrl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  save() {
    if (this.form.dirty && this.form.valid) {
      const f = this.form.value;
      this.loan.startdate = f.start;
      this.loan.deviceBarcode = f.barcode;
      this.loan.userId = this.loan.userId;
      this._loanSvc.checkDeviceAvailable(f.barcode)
        .subscribe(
          res => {
            if (res) { this._dialogRef.close(this.loan); } else { alert('This device is already on loan'); }
          },
          err => alert(err)
        );
    }
  }

  selectedValue(val: User) {
    const v = new User().deserialize(val);
    this.loan.userId = val.userId;
  }

  filter(val: string): IUser[] {
    return this._users.filter(user => user.name.toLowerCase().indexOf(val.toLowerCase()) === 0 );
  }

  errorHandler(error: any) {
    console.error('Error in loan component: ' + error.message || error);
    this._error = error.message || error;
  }
}
