import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
  MatAutocompleteModule,
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';

import { LoanRoutingModule } from './loan-routing.module';
import { LoanComponent } from './loan.component';

import { LoanService } from './loan.service';
import { LoanDialogComponent } from './dialogs/loan-dialog.component';
import { DeviceService } from '../setup/device/device.service';
import { EditDialogComponent } from './dialogs/edit-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog.component';

@NgModule({
  imports: [
    CommonModule,
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
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    LoanRoutingModule
  ],
  declarations: [
    LoanComponent,
    LoanDialogComponent,
    EditDialogComponent,
    ReturnDialogComponent
  ],
  providers: [
    LoanService,
    {provide: LOCALE_ID, useValue: 'en-AU'},
    DeviceService
  ],
  entryComponents: [
    LoanDialogComponent,
    EditDialogComponent,
    ReturnDialogComponent
  ]
})
export class LoanModule { }
