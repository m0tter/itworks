import { Router } from 'express';
import { Response } from 'express-serve-static-core';
import { Device, IDeviceModel, DeviceType, IDeviceTypeModel, DeviceModel, IDeviceModel_Model } from '../models/device.model';
import * as bpsr from 'body-parser';
import * as utils from '../utils';
import { Op } from 'sequelize';
import { DeviceContract } from '../models/device-contract.model';
import { Contract } from '../models/contract.model';

export class DeviceAPI { 
  public router = Router();

  constructor() { this.buildRouter(); }

  getDevice(id: number, cb: (result: IDeviceModel) => void) {
    Device.findById(id, {include: [
      {
        model: DeviceModel, as: 'model'
      },
      {
        model: Contract, as: 'contracts'
      }
    ]})
      .then(result => cb(result))
      .catch(err => { throw new Error(err.message); });
  }

  buildRouter(): any {
    this.router.get('/', (req, res) => {
      Device.findAll({include: [
        {
          model: DeviceModel, as: 'model'
        },
        {
          model: Contract, as: 'contracts'
        }
      ]})
        .then(result => res.status(200).json({'success': true, 'data': result}))
        .catch(err => {
          console.error('Error gettings devices. ' + err.message);
          res.status(200).json({'success': false, 'data': err.message});
        });
    });

    

    // Device Paths

    this.router.post('/', bpsr.json(), (req, res) => {
      try {
        const d = <IDeviceModel>req.body;
        Device.create({
          barcode: d.barcode,
          serialNumber: d.serialNumber,
          name: d.name,
          purchaseDate: d.purchaseDate,
          disposalDate: d.disposalDate,
          macWired: d.macWired,
          macWireless: d.macWireless,
          modelId: d.modelId
        }).then(deviceResult => {
          if(d.contracts && d.contracts.length > 0) {
            let count = 0;
            d.contracts.forEach(e => {
              DeviceContract.create({
                contractId: e.id,
                deviceId: deviceResult.id
              })
              .then(contractResult => {
                if((++count) === d.contracts.length) {
                  this.getDevice(deviceResult.id, (device => { 
                    res.status(200).json({'success': true, 'data': device}); 
                  }));
                }
              })
              .catch(contractErr => {
                throw new Error(contractErr.message);
              })
            });
          } else {
            this.getDevice(deviceResult.id, (device => { 
              res.status(200).json({'success': true, 'data': device}); 
            }));
          }
        }).catch(err => {
          res.status(200).json({'success': false, 'data': err});
        });
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred creating a new device');
      }
    });

    this.router.patch('/:id', bpsr.json(), (req, res) => {
      try {
        if (req.params.id) {
          const d = <IDeviceModel>req.body;
          Device
            .update(
              {
                barcode: d.barcode,
                serialNumber: d.serialNumber,
                name: d.name,
                purchaseDate: d.purchaseDate,
                disposalDate: d.disposalDate,
                macWired: d.macWired,
                macWireless: d.macWireless,
                modelId: d.modelId
              },
              { 
                where: { id: req.params.id }
              })
            .then(result => {
              if(d.contracts) {
                DeviceContract.destroy({where: {deviceId: d.id}})
                  .then(delResult => {
                    let count = 0;
                    d.contracts.forEach(e => {
                      DeviceContract.create({
                        contractId: e.id,
                        deviceId: d.id
                      })
                      .then(contractResult => {
                        if((++count) === d.contracts.length) { res.status(200).json({'success': true, 'data': result}); }
                      })
                    });
                  })
                  .catch(err => res.status(200).json({'success': false, 'data': 'Error deleting associated contracts. ' + err.message}));
                } else {
                  res.status(200).json({'success': true, 'data': result});
                }
            })
            .catch(err => res.status(200).json({'success': false, 'data': err})
          );
        }
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred updating the device in the database')
      }
    });

    this.router.delete('/:id', (req, res) => {
      try {
        if(req.params.id) {
          Device
            .destroy(
              {
                where: { id: req.params.id }
              })
            .then(result => res.status(200).json({'success': true, 'data': result}))
            .catch(err => res.status(200).json({'success': false, 'data': err}));
        }
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred deleting the device from the database')
      }
    });

    /// end Device Paths

    // Type Paths

    this.router.get('/type', (req, res) => {
      try {
        DeviceType.findAll({include: [{model: DeviceModel, as: 'models'}]})
          .then(result => { res.status(200).json({'success': true, 'data': result})})
          .catch(err => { res.status(200).json({'success': false, 'data': err})})
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred getting device types');
      }
    });

    this.router.post('/type', bpsr.json(), (req, res) => {
      try {
        const t = <IDeviceTypeModel>req.body;
        DeviceType.create({
          type: t.type
        }).then(result => {
          res.status(200).json({'success': true, 'data': result});
        }).catch(err => {
          res.status(200).json({'success': false, 'data': err});
        });
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred while adding a new device type');
      }
    });

    /// end Type Paths

    // Model Paths

    this.router.patch('/model', bpsr.json(), (req, res) => {
      try {
        const t = <IDeviceModel_Model>req.body;

        DeviceModel.update({
          model: t.model,
          deviceTypeId: t.deviceTypeId
        }, {
          where: { id: t.id }
        })
        .then(result => res.status(200).json({'success': true, 'data': result}))
        .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred updating a device model')
      }
    });

    this.router.post('/model', bpsr.json(), (req, res) => {
      try {
        const t = <IDeviceModel_Model>req.body;
        DeviceModel.create({
          model: t.model,
          deviceTypeId: t.deviceTypeId
        }).then(result => {
          res.status(200).json({'success': true, 'data': result});
        }).catch(err => {
          res.status(200).json({'success': false, 'data': err});
        });
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred add a device model');
      }
    })

    this.router.get('/model/count/:id', (req, res) => {
      try {
        Device.count({where: {deviceModelId: {[Op.eq]:req.params.id}}})
          .then(result => res.status(200).json({'success': true, 'data': result}))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred counting number of devices using model')
      }
    });

    this.router.delete('/model/:id', (req, res) => {
      try {
        Device.count({where: {deviceModelId: {[Op.eq]:req.params.id}}})
        .then(count => {
          if(count) {
            res.status(200).json({'success': false, 'data': 'existing'});
          } else {
            DeviceModel.destroy({where: {id: {[Op.eq]:req.params.id}}})
            .then(result => res.status(200).json({'success': true, 'data': result}))
            .catch(err => res.status(200).json({'success': false, 'data': err}));
          }
        })
        .catch(err => res.status(200).json({'success': false, 'data': err}))
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred trying to delete a type model');
      }
    });

    this.router.get('/count/all', (req, res) => {
      try {
        Device.findAll()
          .then(result => res.status(200).json({'success': true, 'data': result.length }))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred counting current devices');
      }
    });

    this.router.get('/count/spares', (req, res) => {
      try {
        Device.count({where: {spare: {[Op.eq]: true}}})
          .then(result => res.status(200).json({'success': true, 'data': result}))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred while counting spare devices')
      }
    })

    this.router.get('/model', (req, res) => {
      try {
        DeviceModel.findAll({include: [{model: DeviceType}]})
          .then(result => {
            res.status(200).json({'success': true, 'data': result});
          })
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch (e) {
        this.errorHandler(e, res, 'An error occurred getting models from the database');
      }
    });

    this.router.get('/setup-db/device', (req, res) => {
      DeviceType.sync({force: true}).then(() => {
        DeviceModel.sync({force: true}).then(() => {
          Device.sync({force: true}).then(() => { res.status(200).json({'message': 'device tables created'}); }); 
    })})});

    this.router.get('/setup-db/devicecontract', (req, res) => {
      DeviceContract.sync({force: true}).then(() => {
        res.status(200).json({'message': 'device-contract table created'});
      })
    });
  }

  errorHandler(error:any, response:Response, msg?:string){
    console.error(error.message||error);
    response.status(500).json({'success': false, 'data': msg || error});
  }
}