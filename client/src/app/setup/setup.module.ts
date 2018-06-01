import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatIconModule,
  MatTabsModule
} from '@angular/material';

import { SetupComponent } from './setup.component';
import { SetupRoutingModule } from './setup-routing.module';
import { ContractComponent } from './contract/contract.component';
import { VendorComponent } from './vendor/vendor.component';
import { DeviceComponent } from './device/device.component';
import { DeviceTypeComponent } from './device-type/device-type.component';
import { ContractTypeComponent } from './contract-type/contract-type.component';

import { ContractService } from './contract/contract.service';
import { VendorService } from './vendor/vendor.service';
import { SetupService } from './setup.service';
import { DeviceService } from './device/device.service';
import { DeviceTypeService } from './device-type/device-type.service';
import { ContractTypeService } from './contract-type/contract-type.service';

import { VendorDialogComponent } from './vendor/dialogs/vendor-dialog.component';
import { DeviceDialogComponent } from './device/dialogs/device-dialog.component';
import { DeviceTypeDialogComponent } from './device-type/device-type-dialog.component';
import { ContractDialogComponent } from './contract/dialogs/contract-dialog.component';
import { YesNoDialogComponent } from '../common/dialogs';
import { OKDialogComponent } from '../common/dialogs';
import { ContractTypeDialogComponent } from './contract-type/dialogs/contract-type-dialog.component';
import { ContractSelectDialogComponent } from './device/dialogs/contract-select-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatTabsModule,
    MatIconModule,
    SetupRoutingModule
  ],
  declarations: [
    SetupComponent,
    ContractComponent,
    VendorComponent,
    VendorDialogComponent,
    DeviceComponent,
    DeviceDialogComponent,
    DeviceTypeComponent,
    YesNoDialogComponent,
    OKDialogComponent,
    DeviceTypeDialogComponent,
    ContractDialogComponent,
    ContractTypeComponent,
    ContractTypeDialogComponent,
    ContractSelectDialogComponent
  ],
  providers: [
    SetupService,
    ContractService,
    VendorService,
    DeviceService,
    DeviceTypeService,
    ContractTypeService
  ],
  entryComponents: [
    VendorDialogComponent,
    DeviceDialogComponent,
    YesNoDialogComponent,
    OKDialogComponent,
    DeviceTypeDialogComponent,
    ContractDialogComponent,
    ContractTypeDialogComponent,
    ContractSelectDialogComponent
  ]
})
export class SetupModule { }
