import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Http, Response } from '@angular/http';
import { API_CONTRACTTYPE } from '../../_api.paths';
import { ApiResponse, ContractType } from '../../_types';

@Injectable()
export class ContractTypeService {

  constructor(
    private _http: Http
  ) { }

  getTypes(): Observable<ContractType[]> {
    return this._http.get(API_CONTRACTTYPE)
      .map((resp: Response) => {
        const res = new ApiResponse().deserialize(resp.json());
        if (res.success) {
          return res.toClass(ContractType);
        } else {
          throw new Error('error getting contract types from database. ' + res.data);
        }
      })
      .catch(err => { throw new Error(err); });
  }

  newContractType(ct: ContractType): Observable<ContractType> {
    return this._http.post(API_CONTRACTTYPE, ct)
      .map((resp: Response) => {
        const res = new ApiResponse().deserialize(resp.json());
        if (res.success) {
          return res.toClass(ContractType);
        } else {
          throw new Error('error creating contract type in database. ' + res.data);
        }
      })
      .catch(err => { throw new Error(err); });
  }

  deleteContractType(id: number): Observable<boolean> {
    return this._http.delete(`${API_CONTRACTTYPE}/${id}`)
      .map((http: Response) => {
        const rt = new ApiResponse().deserialize(http.json());
        if (rt.success) {
          return true;
        } else {
          if (rt.data === 'existing') {
            console.error('the contract type is still in use');
            throw new Error(rt.data);
          }
          return false;
        }
      });
  }

  editContractType(ct: ContractType): Observable<boolean> {
    return this._http.patch(`${API_CONTRACTTYPE}/${ct.id}`, ct)
      .map((http: Response) => {
        const ar = new ApiResponse().deserialize(http.json());
        if (ar.success) {
          return true;
        } else {
          throw new Error('error updating contract type in database. ' + ar.data);
        }
      })
      .catch(err => Observable.throw('error updating contract type in the database. ' + err));
  }
}
