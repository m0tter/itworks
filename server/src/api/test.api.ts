import  { Router, Request, Response, NextFunction } from 'express';
// import * as sql from 'mssql';

const sql = require('mssql');

export class TestAPI { 
  public router = Router();
  dbConn:any

  constructor(){
    sql.on('error', (err:any) => {
      // oh no there's water leaking in
    })
    this.dbConn = new sql.ConnectionPool('mssql://itworks:!tw0rks@it01.gslc.local/sqlexpress/itworks');
    this.buildRouter();
  }

  buildRouter():void {
    this.router.get('/', (req:Request, res:Response) => {
      this.dbConn.connect().then( ()=> {
        var request = new sql.Request(this.dbConn);
        request.query("select * from test")
          .then((recordset:any) => {
            res.status(200).json({'success': true, data: recordset});
            this.dbConn.close();
          })
          .catch((err:any) => {
            res.status(401).json({'success': false, data: err});
            this.dbConn.close();
          });
      })
      .catch((err:any) => {
        res.status(401).json({'success': false, data: err});
      });
    });
  }
}