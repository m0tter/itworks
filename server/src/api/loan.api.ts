import { Router } from 'express';
import { Response } from 'express-serve-static-core';
import { Device, IDeviceModel, DeviceType, IDeviceTypeModel, DeviceModel, IDeviceModel_Model } from '../models/device.model';
import { Loan, ILoanModel } from '../models/loan.model';
import * as bpsr from 'body-parser';
import * as utils from '../utils';
import { TassStudent, TassStaff } from '../models/tass.model';
import { Op } from 'sequelize';

export class LoanAPI {
  public router = Router();

  constructor() { this.buildRouter(); }

  buildRouter(): any {
    // all loans
    this.router.get('/', (req, res) => {
      try { 
        Loan.findAll({include: [Device, TassStudent, TassStaff]})
          .then(result => {
            res.status(200).json({'success': true, 'data': result});
          })
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) { 
        this.errorHandler(e, res, 'An error occurred getting loans from the database') 
      }
    });

    this.router.post('/', bpsr.json(), (req, res) => {
      try {
        const l = <ILoanModel>req.body;
        if (!l || !l.userId || !l.deviceBarcode) {
          res.status(200).json({'success': false, 'data': 'Can not create loan, missing userid or device barcode'});
        } else {
          Loan.create({
            startdate: l.startdate,
            deviceBarcode: l.deviceBarcode,
            userId: l.userId
          }).then(result => {
            console.log('result.id=' + result.id);
            Loan.findById(result.id, {include: [Device, TassStudent, TassStaff]})
              .then(newLoan => res.status(200).json({'success': true, 'data': newLoan}))
              .catch(err => res.status(200).json({'success': false, 'data': err}));
          }).catch(err => {
            res.status(200).json({'success': false, 'data': err});
          });
        }
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred creating the loan');
      }
    });

    this.router.patch('/:id', bpsr.json(), (req, res) => {
      try {
        if (req.params.id) {
          const l = <ILoanModel>req.body;
          if (!l || !l.userId || !l.deviceBarcode) {
            res.status(200).json({'success': false, 'data': 'Can not update loan, missing userid or device barcode'});
          } else {
            Loan
              .update(
                {
                  userId: l.userId,
                  deviceBarcode: l.deviceBarcode,
                  startdate: l.startdate,
                  enddate: l.enddate,
                  notes: l.notes,
                  lost: l.lost
                },
                {
                  where: { id: req.params.id }
                })
              .then(result => res.status(200).json({'success': true, 'data': result}))
              .catch(err => res.status(200).json({'success': false, 'data': err})
            );
          }
        }
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred updating the loan in the database');
      }
    });

    // current loans
    this.router.get('/current', (req, res) => {
      try { 
        Loan.findAll({where: {enddate: {[Op.is]:null}}, include: [Device, TassStudent, TassStaff], order: [['startdate', 'DESC']]})
          .then(result => {
            res.status(200).json({'success': true, 'data': result});
          })
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) { 
        this.errorHandler(e, res, 'An error occurred getting current loans from the database') 
      }
    });

    this.router.get('/count/all', (req, res) => {
      try {
        Loan.count({where: {enddate: {[Op.is]:null}}})
          .then(result => res.status(200).json({'success': true, 'data': result}))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch (e) {
        this.errorHandler(e, res, 'An error occurred counting the number of loans');
      }
    });

    this.router.get('/count/spares', (req, res) => {
      try {
        Loan.count({where: {enddate: {[Op.is]:null}}, include: [{model: Device, where: {spare: { [Op.eq]:true }}}]})
          .then(result => res.status(200).json({'success': true, 'data': result}))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch (e) {
        this.errorHandler(e, res, 'An error occurred counting the number of spares on loan');
      }
    });

    this.router.get('/check/:id', (req, res) => {
      try {
        Loan.findOne({ 
          where: { deviceBarcode: req.params.id }})
          .then(result => {
            if(result){
              if(result.enddate === null) {
                res.status(200).json({'success': true, 'data': false});
              } else {
                res.status(200).json({'success': true, 'data': true});
              }
            } else {
              Device.findOne({where: { barcode: req.params.id }})
                .then(dev => {
                  if(dev) {
                    res.status(200).json({'success': true, 'data': true});
                  } else {
                    res.status(200).json({'success': false, 'data': 'Device does not exist in database'});
                  }
                })
                .catch(err => res.status(200).json({'success': false, 'data': err}));
            }
          })
          .catch(err => {
            res.status(200).json({'success': false, 'data': err});
          });
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred checking availability')
      }
    });

    this.router.get('/setup-db', (req, res) => {
      Loan.sync({force: true}).then(() => {
        res.status(200).json({'message': 'Loan table created'});
      })
    });
  }

  errorHandler(error:any, response:Response, msg?:string){
    console.error(error.message||error);
    response.status(500).json({'success': false, 'data': msg || error});
  }
}