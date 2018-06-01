import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { StatComponent } from '../common/stat/stat.component';

import { NavService } from '../_services';
import { LoanService } from '../_services';
import { DeviceService } from '../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private _deviceCount = 0;
  private _loanCount = 0;
  private _loading = true;
  private _error = '';
  private _sparesOnLoanCount = 0;
  private _spareCount = 0;
  private _loadedCount = 0;

  constructor (
    private navService: NavService,
    private _loanSvc: LoanService,
    private _deviceSvc: DeviceService
  ) { }

  ngOnInit() {
    this.navService.hide();

    this._loanSvc.getCountAll()
      .subscribe(
        res => this._loanCount = res,
        err => this.errorHandler(err),
        () => this.hideLoading()
      );

    this._loanSvc.getCountSparesLoans()
    .subscribe(
      res => this._sparesOnLoanCount = res,
      err => this.errorHandler(err),
      () => this.hideLoading()
    );

    this._deviceSvc.getCountAll()
      .subscribe(
        res => this._deviceCount = res,
        err => this.errorHandler(err),
        () => this.hideLoading()
      );

    this._deviceSvc.getSpareCount()
      .subscribe(
        res => this._spareCount = res,
        err => this.errorHandler(err),
        () => this.hideLoading()
      );
  }

  hideLoading() {
    if (++this._loadedCount === 4) { this._loading = false; }
  }

  errorHandler(error: any) {
    console.error('Error in dashboard component: ' + error.message || error);
    this._error = error.message || error;
  }

}
