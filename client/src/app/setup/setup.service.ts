import { Injectable } from '@angular/core';
import { NavService } from '../services/nav.service';

@Injectable()
export class SetupService {
  _navSetup = false;

  constructor( private _navService: NavService ) { }

  setupNav() {
    this._navService.show();
    this._navService.setNavItems([
      {
        name: 'Contracts',
        route: 'setup/contracts'
      },
      {
        name: 'Contract Types',
        route: 'setup/contract-type'
      },
      {
        name: 'Devices',
        route: 'setup/device'
      },
      {
        name: 'Device Types',
        route: 'setup/device-type'
      },
      {
        name: 'Vendors',
        route: 'setup/vendor'
      }
    ]);
    this._navSetup = true;
  }

  showNav() {
    if (this._navSetup) { this._navService.show(); } else { this.setupNav(); }
  }

  hideNav() { this._navService.hide(); }
}
