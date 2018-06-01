import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractComponent } from './contract/contract.component';
import { VendorComponent } from './vendor/vendor.component';
import { SetupComponent } from './setup.component';
import { DeviceComponent } from './device/device.component';
import { DeviceTypeComponent } from './device-type/device-type.component';
import { ContractTypeComponent } from './contract-type/contract-type.component';

const routes: Routes = [
  { path: '', component: SetupComponent },
  { path: 'contracts', component: ContractComponent },
  { path: 'vendor', component: VendorComponent },
  { path: 'device', component: DeviceComponent },
  { path: 'device-type', component: DeviceTypeComponent },
  { path: 'contract-type', component: ContractTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
