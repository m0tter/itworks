import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device, DeviceModel, DeviceType } from '../../_types';
import { API_DEVICE } from '../../_api.paths';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { plainToClass } from 'class-transformer';
import { OKDialogComponent } from '../../common/dialogs';


@Injectable()
export class DeviceTypeService {

  constructor(
    private _http: Http
  ) { }

  getTypes(): Observable<DeviceType[]> {
    return this._http.get(`${API_DEVICE}/type`)
      .map((res: Response) => {
        const json = res.json();
        if (json.success) { return this.JSONtoDeviceTypes(json.data); } else { this.errorHandler(json.data); }
      })
      .catch(err => Observable.throw(err));
  }

  editModel(model: DeviceModel): Observable<boolean> {
    return this._http.patch(`${API_DEVICE}/model`, model)
      .map((res: Response) => {
        const json = res.json();
        if (json.success && true) {
          return true;
        } else {
          this.errorHandler(json.data, 'Error updating model, please see log');
          return false;
        }
      })
      .catch(err => Observable.throw(err));
  }

  addModel(model: DeviceModel): Observable<DeviceModel> {
    return this._http.post(`${API_DEVICE}/model`, model)
      .map((res: Response) => {
        const json = res.json();
        if (json.success && true) {
          return plainToClass(DeviceModel, json.data);
        } else { return null; }
      })
      .catch(err => Observable.throw(err));
  }

  deleteModel(model: DeviceModel): Observable<boolean> {
    return this._http.delete(`${API_DEVICE}/model/${model.id}`)
      .map((res: Response) => {
        const json = res.json();
        if (json.success && true) {
          return true;
        } else {
          if (json.data === 'existing') {
            console.log('json.data=' + JSON.stringify(json.data));
            throw new Error(json.data);
          }
          return false;
        }
      });
  }

  addType(dt: DeviceType): Observable<DeviceType> {
    return this._http.post(`${API_DEVICE}/type`, dt)
      .map((res: Response) => {
        const json = res.json();
        if (json.success && true) {
          const t = plainToClass(DeviceType, <DeviceType>json.data);
          t.models = [];
          return t;
        } else {
          throw new Error(json.data);
        }
      })
      .catch(err => Observable.throw(err));
  }

  JSONtoDeviceTypes(json: DeviceType[]): DeviceType[] {
    const types: DeviceType[] = [];
    try {
      for (const dt of json) {
        types.push(this.JSONtoDeviceType(dt));
      }
    } catch (e) { console.log('device-type.service.toDeviceTypes error: ' + e); }
    return types;
  }

  JSONtoDeviceType(json: DeviceType): DeviceType {
    return plainToClass(DeviceType, json);
  }

  private errorHandler(error: any, msg?: string) {
    console.error('An error occurred in device-type.service', error.message || JSON.stringify(error));

    throw new Error(msg || 'An error occurred in device-type.service, please check the logs');
  }

}
