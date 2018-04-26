import { Application } from 'express';

import { VendorAPI } from '../api/vendor.api';
import { TassAPI } from '../api/tass.api';
import { DeviceAPI } from '../api/device.api';
import { LoanAPI } from '../api/loan.api';
import { ContractAPI } from '../api/contract.api';

const API_VER = '1';

export default function registerRoutes(app: Application):void {
  app.use( `/api/${API_VER}/vendor`, new VendorAPI().router );
  app.use( `/api/${API_VER}/tass`, new TassAPI().router );
  app.use( `/api/${API_VER}/device`, new DeviceAPI().router );
  app.use( `/api/${API_VER}/loan`, new LoanAPI().router );
  app.use( `/api/${API_VER}/contract`, new ContractAPI().router );
}