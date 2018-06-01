import { Injectable, Inject } from '@angular/core';
import { NavService } from '../services/nav.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { plainToClass } from 'class-transformer';
import { Loan, Device, TassStudent, IUser, TassStaff, User } from '../_types';
import { API_LOAN } from '../_api.paths';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

interface LoanOptions {
  current?: boolean;
}

@Injectable()
export class LoanService {
  _navSetup = false;

  constructor(
    private _navService: NavService,
    private _http: Http
  ) { }

  getCurrentLoans(): Observable<Loan[]> {
    return this.getLoans({current: true});
  }

  getAllLoans(): Observable<Loan[]> {
    return this.getLoans({current: false});
  }

  getLoans(options?: LoanOptions): Observable<Loan[]> {
    let url = API_LOAN;
    if (options && options.current) { url = `${url}/current`; }
    return this._http.get(url)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return this.JSONtoLoans(json.data);
        } else {
          this.errorHandler(json.data);
        }
      })
      .catch(err => Observable.throw(err));
  }

  JSONtoLoans(json: Loan[]): Loan[] {
    const loans = [];
    try {
      json.forEach(e => {
        loans.push(new Loan().deserialize(e)); });
      return loans;
    } catch (e) {
      throw new Error('Error converting http response to Loans. ' + e.message);
    }
  }

  newLoan(loan: Loan): Observable<Loan> {
    return this._http.post(API_LOAN, loan)
      .map(res => {
        const json = res.json();
        if (json.success) {
          // return this.JSONtoLoan(json.data);
          return new Loan().deserialize(json.data);
        } else {
          this.errorHandler(json.data, 'Error saving loan to the database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  editLoan(loan: Loan): Observable<boolean> {
    return this._http.patch(`${API_LOAN}/${loan.id}`, loan)
      .map(res => {
        const json = res.json();
        if (json.success && json.data[0]) {
          return true;
        } else {
          this.errorHandler(json.data, 'An error occurred editing the loan');
        }
      })
      .catch(err => Observable.throw(err));
  }

  checkDeviceAvailable(barcode: string): Observable<boolean> {
    return this._http.get(`${API_LOAN}/check/${barcode}`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          this.errorHandler(json.data, 'Device does not exist in the database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  getCountAll(): Observable<number> {
    return this._http.get(`${API_LOAN}/count/all`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          this.errorHandler(json.data, 'Error getting loan count from database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  // returns the number of spare laptops on loan
  getCountSparesLoans(): Observable<number> {
    return this._http.get(`${API_LOAN}/count/spares`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          this.errorHandler(json.data, 'Error getting spares on loan count from database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  setupNav() {
    this._navService.show();
    this._navService.setNavItems([
      {
        name: 'Bulk Loan',
        route: 'loan/new'
      },
      {
        name: 'Bulk Return',
        route: 'loan/return'
      }
    ]);
    this._navSetup = true;
  }

  showNav() {
    if (this._navSetup) { this._navService.show(); } else { this.setupNav(); }
  }

  hideNav() { this._navService.hide(); }

  private errorHandler(error: any, msg?: string) {
    console.error('An error occurred in loan.service', error.message || JSON.stringify(error));

    throw new Error(msg || 'An error occurred in loan.service, please check the logs');
  }
}
