import { Router } from 'express';
import * as bpsr from 'body-parser';
import * as utils from '../utils';
import { TassStudent, TassStudentModel, TassStaff, ITassStaffModel } from '../models/tass.model';
import { Response } from 'express-serve-static-core';
import { Op } from 'sequelize';

export class TassAPI {
  public router = Router();

  constructor() { this.buildRouter(); }

  buildRouter(): any {
    this.router.get('/student', (req, res) => {
      TassStudent.findAll({where: {dol: {[Op.is]:null}}, order: [['surname', 'ASC'], ['preferred_name', 'ASC']]})
        .then(result => res.status(200).json({'success': true, 'data':result}))
        .catch(err => res.status(200).json({'success':false, 'data':err}));
    });

    this.router.get('/student/:id', (req, res) => {
      try {
        TassStudent.findOne({
          where: { stud_code: req.params.id }
        }).then(result => { res.status(200).json({'success': true, 'data': result})
        }).catch(err => { res.status(200).json({'success': false, 'data': err}); });
      } catch (e) {
        this.errorHandler(e, res, 'An error occurred processing the student get command');
      }
    });

    this.router.get('/staff', (req, res) => {
      try {
        TassStaff.findAll()
          .then(result => res.status(200).json({'success': true, 'data': result}))
          .catch(err => res.status(200).json({'success': false, 'data': err}));
      } catch(e) {
        this.errorHandler(e, res, 'An error occurred processing the staff get all command');
      }
    });
  }

  errorHandler(error:any, response:Response, msg?:string){
    console.error(error.message||error);
    response.status(500).json({'success': false, 'data': msg || error});
  }
}
