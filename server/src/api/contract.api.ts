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

export class ContractAPI {
  public router = Router();

  constructor() { this.buildRouter(); }

  buildRouter(): any {
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

    this.router.get('/setup-db', (req, res) => {
      ContractType.sync({force: true}).then(() => {
        Contract.sync({force: true}).then(() => {
          res.status(200).json({'message': 'database tables created'});
        });
      });
    });
  }
}
