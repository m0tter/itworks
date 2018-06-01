import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { StatComponent } from './stat.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    RouterModule
  ],
  declarations: [ StatComponent ],
  exports: [ StatComponent ]
})
export class StatModule { }
