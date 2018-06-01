import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Device, DeviceModel } from '../../_types';
import { Response } from '@angular/http/src/static_response';
import { API_DEVICE } from '../../_api.paths';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DeviceService {

  constructor(
    private http: Http
  ) { }

  getDevices(): Observable<Device[]> {
    return this.http.get(API_DEVICE)
      .map((res: Response) => {
        const json = res.json();
        if (json.success) {
          const devices: Device[] = [];
          json.data.forEach((e: Device) => {
            const d = plainToClass(Device, <Device>e);
            if (e.model) {
              d.model = plainToClass(DeviceModel, <DeviceModel>e.model);
            } else {
              d.model = new DeviceModel();
              d.model.model = 'undefined';
            }
            devices.push(d);
          });
          return devices;
        } else {
          this.errorHandler(json.data, 'Error getting devices from database. ' + JSON.stringify(json.data));
        }
      })
      .catch(err => Observable.throw(err));
  }

  getDevice(barcode: string): Observable<Device> {
    return this.http.get(`${API_DEVICE}/${barcode}`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          this.errorHandler(json.data, 'Error getting device from database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  newDevice(device: Device): Observable<Device> {
    return this.http.post(API_DEVICE, device)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          if (json.data && json.data.parent.number) {
            this.errorHandler(json.data, 'A device with the same barcode already exists');
          } else {
            this.errorHandler(json.data);
          }
        }
        Observable.throw('newDevice has let the cat out');
      })
      .catch(err => Observable.throw(err));
  }

  deleteDevice(id: number): Observable<boolean> {
    return this.http.delete(`${API_DEVICE}/${id}`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return true;
        } else {
          this.errorHandler(json.data, 'An error occurred deleting the device from the database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  editDevice(device: Device): Observable<boolean> {
    return this.http.patch(`${API_DEVICE}/${device.id}`, device)
      .map(res => {
        const json = res.json();
        if (json.success && json.data[0]) {
          return true;
        } else {
          this.errorHandler(json.data, 'An error occurred editing the device');
        }
      })
      .catch(err => Observable.throw(err));
  }

  getCountAll(): Observable<number> {
    return this.http.get(`${API_DEVICE}/count/all`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          this.errorHandler(json.data, 'Error getting device count form database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  getSpareCount(): Observable<number> {
    return this.http.get(`${API_DEVICE}/count/spares`)
      .map(res => {
        const json = res.json();
        if (json.success) {
          return json.data;
        } else {
          this.errorHandler(json.data, 'Error getting spare count from database');
        }
      })
      .catch(err => Observable.throw(err));
  }

  private errorHandler(error: any, msg?: string) {
    console.error('An error occurred in device.service', error.message || JSON.stringify(error));

    throw new Error(msg || 'An error occurred in device.service, please check the logs');
  }
 }
