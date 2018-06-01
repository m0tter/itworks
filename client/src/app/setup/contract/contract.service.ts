import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Contract, Vendor, ApiResponse, ContractType } from '../../_types';
import { API_CONTRACT } from '../../_api.paths';
import { Observable } from 'rxjs/Observable';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ContractService {
  private _options: RequestOptions;

  constructor(
    private _http: Http
  ) { }

  getContracts(): Observable<Contract[]> {
    return this._http.get(API_CONTRACT)
      .map((res: Response) => {
        const json = res.json();
        if (json.success) {
          const cts: Contract[] = [];
          json.data.forEach((e: Contract) => {
            const c = plainToClass(Contract, e);
              if (e.vendor) {
                c.vendor = plainToClass(Vendor, <Vendor>e.vendor);
              } else {
                c.vendor = new Vendor();
                c.vendor.name = 'undefined';
              }
              if (e.type) {
                c.type = plainToClass(ContractType, <ContractType>e.type);
              } else {
                c.type = new ContractType();
                c.type.type = 'undefined';
              }
              cts.push(c);
          });
          return cts;
        } else {
          this.errorHandler(json.data, 'Error getting contracts from the database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  newContract(contract: Contract): Observable<Contract> {
    return this._http.post(API_CONTRACT, contract)
      .map((response: Response) => {
        const result = new ApiResponse().deserialize(response.json());
        if (result.success) {
          const c = new Contract().deserialize(result.data);
          return c;
        } else {
          throw new Error('unable to save new contract. ' + result.data);
        }
      })
      .catch(err => Observable.throw(err));
  }

  editContract(ct: Contract): Observable<boolean> {
    return this._http.patch(`${API_CONTRACT}/${ct.id}`, ct)
      .map((http: Response) => {
        const ar = new ApiResponse().deserialize(http.json());
        if (ar.success) {
          return true;
        } else {
          throw new Error('error updating contract in the database. ' + ar.data);
        }
      })
      .catch(err => Observable.throw('error updating contract in the database. ' + err.message));
  }

  deleteContract(id: number): Observable<boolean> {
    return this._http.delete(`${API_CONTRACT}/${id}`)
      .map((http: Response) => {
        const ar = new ApiResponse().deserialize(http.json());
        if (ar.success) { return ar.success; } else { throw new Error(ar.data); }
      })
      .catch(err => {
        if (err.message === 'existing') { return Observable.throw(new Error(err.message)); }
        return Observable.throw(new Error('Error deleting contract from the database. ' + err.message));
      });
  }

  private errorHandler(error: any, msg?: string) {
    console.error('An error occurred in contract.service', error.message || JSON.stringify(error));

    throw new Error(msg || 'An error occurred in contract.service, please check the logs');
  }
}
