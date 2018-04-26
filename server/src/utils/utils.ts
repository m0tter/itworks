import { Response, Request } from "express";
import { NextFunction } from "express-serve-static-core";
import { Sequelize } from 'sequelize';
import * as config from '../config/db.config';

const sql = require('mssql');

export function tokenCheck(req: Request, res: Response, next: NextFunction) {
  // TODO: finish this
  next();
}

export function dbExec(query:string, cb:Function) {
  sql.connect(config.connectionString).then((pool:any) => {
    pool.request().query(query)
      .then((recordset:any) => {
        sql.close();
        cb(recordset);
      })
      .catch((err:any) => { 
        sql.close();
        cb(null,err);
      });
  }).catch((err:any) => {
    cb(null,err);
   });
}
