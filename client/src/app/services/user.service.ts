import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TassStudent, TassStaff } from '../_types';
import { API_USER, API_TASS } from '../_api.paths';
import { Http } from '@angular/http';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {

  constructor(private _http: Http) { }

  getStudents(): Observable<TassStudent[]> {
    return this._http.get(`${API_TASS}/student`)
      .map(res => {
        const json = res.json();
        if (json.success ) {
          return plainToClass(TassStudent, json.data);
        }
      })
      .catch(err => Observable.throw(err));
  }

  getStaff(): Observable<TassStaff[]> {
    return this._http.get(`${API_TASS}/staff`)
      .map(res => {
        const json = res.json();
        if (json.success) { return plainToClass(TassStaff, json.data); }
      })
      .catch(err => Observable.throw(err));
  }

  private errorHandler(error: any, msg?: string) {
    console.error('An error occurred in user.service', error.message || JSON.stringify(error));

    throw new Error(msg || 'An error occurred in user.service, please check the logs');
  }
}
