import { Router } from 'express';
import * as bpsr from 'body-parser';
import * as utils from '../utils';
import { Vendor, VendorModel, VendorAddModel, VendorViewModel } from '../models/vendor.model'; 
import { Response } from 'express-serve-static-core';

export class VendorAPI {
  public router = Router();

  constructor() { this.buildRouter(); }

  buildRouter(): any {
    this.router.use((req, res, next) => {
      utils.tokenCheck(req, res, next);
    });

    this.router.get('/', (req, res) => {
      Vendor.findAll()
        .then(result => res.status(200).json({'success':true, 'data':result}))
        .catch(err => res.status(200).json({'success':false, 'data':err}));
    });

    this.router.post('/', bpsr.json(), (req, res) => {
      try {
        const v = <VendorModel>req.body;
        Vendor.create({
          name: v.name,
          address1: v.address1,
          address2: v.address2,
          suburb: v.suburb,
          state: v.state
        }).then(result => {
          console.log('vendor post: ' + JSON.stringify(result));
          res.status(200).json({'success': true, 'data': result});
        }).catch(err => {
          console.log('vendor post error:' + JSON.stringify(err));
          res.status(200).json({'success': false, 'data': err});
        });
      } catch(e) {
        console.log('got you: ' + JSON.stringify(e));
      }
    });

    this.router.delete('/:id', (req, res) => {
      try {
        if(req.params.id) { 
          Vendor.destroy({
            where: { id: req.params.id}
          }).then(result => {
            res.status(200).json({'success':true, 'data': result});
          }).catch(err => {
            res.status(200).json({'success': false, 'data': err});
          });
        } else { res.status(200).json({'success': false, 'data': 'id parameter is incorrect or missing'})} 
      } catch (e) {
        this.errorHandler(e, res, 'An error occurred processing the delete command');
       }
    });

    this.router.patch('/:id', bpsr.json(), (req, res) => {
      try {
        if(req.params.id) {
          const v = <VendorModel>req.body;          
          Vendor.update({
              name: v.name,
              address1: v.address1,
              address2: v.address2,
              suburb: v.suburb,
              state: v.state
            },
            { where : { id: req.params.id } }
          ).then(result => {
            console.log('vendor-patch: ' + JSON.stringify(result));
            res.status(200).json({'success': true, 'data': result});
          }).catch(err => {
            res.status(200).json({'success': false, 'data': err});
          });
        }
      }
      catch (e) {
        this.errorHandler(e, res, 'An error occurred processing the patch command');
      }
    });

    this.router.get('/setup-db', (req, res) => {
      Vendor.sync({force: true}).then(() => {
        res.status(200).json({'message': 'database table created'});
      });
    });
  }

  errorHandler(error:any, response:Response, msg?:string){
    console.error(error.message||error);
    response.status(500).json({'success': false, 'data': msg || error});
  }
}

