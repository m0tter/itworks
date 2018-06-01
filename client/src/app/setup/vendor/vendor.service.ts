import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Vendor } from '../../_types';
import { API_VENDOR } from '../../_api.paths';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class VendorService {
  private _options: RequestOptions;

  constructor(
    private http: Http
  ) { }

  getVendors(): Observable<Vendor[]> {
    return this.http.get(API_VENDOR)
      .map((res: Response) => {
        const json = res.json();
        if (json.success) { return <Vendor[]>json.data; } else { throw new Error(json.data); }
      })
      .catch((err: any) => Observable.throw(err.json().error || 'error getting vendors'));
  }

  newVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post(API_VENDOR, vendor)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          if (json.data && json.data.parent.number) {
            if (json.data.parent.number === 2627) {
              this.errorHandler(json.data, 'A vendor with the same name already exists in the database');
            } else {
              this.errorHandler(json.data);
            }
          }
          Observable.throw('newVendor broke');
        }
      })
      .catch(err => Observable.throw(err));
  }

  deleteVendor(id: number): Observable<boolean> {
    return this.http.delete(`${API_VENDOR}/${id}`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return true;
        } else {
          this.errorHandler(json.data, 'An error occurred deleting a vendor');
        }
      })
      .catch(err => Observable.throw(err));
  }

  editVendor(vendor: Vendor): Observable<boolean> {
    return this.http.patch(`${API_VENDOR}/${vendor.id}`, vendor)
      .map(res => {
        const json = res.json();
        if (json.success && json.data[0]) {
          // console.log('editVendor ' + JSON.stringify(json.data[0]));
          return true;
        } else {
          this.errorHandler(json.data, 'An error occurred editing the vendor');
        }
      })
      .catch(err => Observable.throw(err));
  }

  private errorHandler(error: any, msg?: string) {
    console.error('An error occurred in vendor.service', error.message || JSON.stringify(error));

    throw new Error(msg || 'An error occurred in vendor.service, please check the logs');
  }
}
