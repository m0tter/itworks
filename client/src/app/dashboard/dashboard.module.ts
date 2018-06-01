import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StatModule } from '../common/stat/stat.module';

import { LoanService, DeviceService } from '../_services';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    StatModule
  ],
  declarations: [ DashboardComponent ],
  providers: [
    LoanService,
    DeviceService
  ]
})
export class DashboardModule { }
