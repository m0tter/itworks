import { Router } from 'express';
import { Response } from 'express-serve-static-core';
import * as bpsr from 'body-parser';
import * as utils from '../utils';
import { Op } from 'sequelize';
import {
  Contract, 
  IContract_Model, 
  ContractType, 
  IContractType_Model 
} from '../models/contract.model';
import {
  Vendor
} from '../models/vendor.model';
import { DeviceContract } from '../models/device-contract.model';

export class ContractAPI {
  public router = Router();

  constructor() { this.buildRouter(); }

  buildRouter(): any {

    // Contract

    this.router.get('/', (req, res) => {
      Contract.findAll({include: 
        [
          { model: ContractType, as: 'type'},
          { model: Vendor, as: 'vendor' }
        ]
      })
      .then(result => res.status(200).json({'success': true, 'data': result}))
      .catch(err => res.status(200).json({'success': false, 'data': err}));
    });

    this.router.post('/', bpsr.json(), (req, res) => {
      try {
        const c = <IContract_Model>req.body;
        Contract.create({
          name: c.name,
          notes: c.notes,
          vendorId: c.vendorId,
          typeId: c.typeId,
          start: c.start,
          expiry: c.expiry
        }).then(result => {
          Contract.findById(result.id, { include: [{model: Vendor, as: 'vendor'}, {model: ContractType, as: 'type'}]})
            .then(findResult => {
              res.status(200).json({'success': true, 'data': findResult});
            })
            .catch(findErr => {
              res.status(200).json({'success': false, 'data': findErr.message});
            }
          );
        }).catch(err => {
          res.status(200).json({'success': false, 'data': err});
        })
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred creating a contract');
      }
    });

    this.router.delete('/:id', (req, res) => {
      try {
        DeviceContract.count({where: {contractId: {[Op.eq]: req.params.id}}})
          .then(count => {
            if (count) {
              res.status(200).json({'success': false, 'data': 'existing'});
            } else {
              Contract.destroy({where: {id: {[Op.eq]: req.params.id}}})
                .then(result => res.status(200).json({'success': true, 'data': result}))
                .catch(err => res.status(200).json({'success': false, 'data': err}));
            }
          })
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred trying to delete the contract');
      }
    });

    this.router.patch('/:id', bpsr.json(), (req, res) => {
      try {
        const ct = <IContract_Model>req.body;
        if (ct) {
          Contract.update({
            name: ct.name,
            notes: ct.notes,
            vendorId: ct.vendorId,
            typeId: ct.typeId,
            start: ct.start,
            expiry: ct.expiry
          }, {
            where: { id: ct.id }
          })
          .then(result => res.status(200).json({'success': true, 'data': result}))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
        } else {
          res.status(200).json({'success': false, 'data': 'no data received'});
        }
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred updating a contract');
      }
    });

    /// end Contract

    // Contract Type

    this.router.get('/type', (req, res) => {
      ContractType.findAll()
        .then(result => res.status(200).json({'success': true, 'data': result}))
        .catch(err => res.status(200).json({'success': false, 'data': err}))
    });

    this.router.post('/type', bpsr.json(), (req, res) => {
      try {
        const ct = <IContractType_Model>req.body;
        ContractType.create({
          type: ct.type,
          description: ct.description
        }).then(result => {
          res.status(200).json({'success': true, 'data': result});
        }).catch(err => {
          res.status(200).json({'success': false, 'data': err});
        });
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred creating a new contract type');
      }
    })

    this.router.delete('/type/:id', (req, res) => {
      try {
        Contract.count({where: {typeId: {[Op.eq]: req.params.id}}})
          .then(count => {
            if(count) {
              res.status(200).json({'success': false, 'data': 'existing'});
            } else {
              ContractType.destroy({where: {id: {[Op.eq]: req.params.id}}})
                .then(result => res.status(200).json({'success': true, 'data': result}))
                .catch(err => res.status(200).json({'success': false, 'data': err}));
            }
          })
          .catch(err => res.status(200).json({'success': false, 'data': err}))
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred trying to delete a contract type');
      }
    });

    this.router.patch('/type/:id', bpsr.json(), (req, res) => {
      try {
        const ct = <IContractType_Model>req.body;
        ContractType.update(
          {
            type: ct.type,
            description: ct.description
          }, {
            where: { id: req.params.id }
        })
        .then(result => res.status(200).json({'success': true, 'data': result}))
        .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred updating a contract type');
      }
    });

    /// end Contract Type

    this.router.get('/setup-db', (req, res) => {
      ContractType.sync().then(() => {
        Contract.sync().then(() => {
          res.status(200).json({'message': 'database tables created'});
        });
      });
    });
  }

  errorHandler(error:any, response:Response, msg?:string){
    console.error(error.message||error);
    response.status(500).json({'success': false, 'data': msg || error});
  }
}
