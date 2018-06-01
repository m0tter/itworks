import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LoanService } from './loan.service';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort, MatTable } from '@angular/material';
import { Loan } from '../_types';
import { LoanDialogComponent } from './dialogs/loan-dialog.component';
import { EditDialogComponent } from './dialogs/edit-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog.component';
import { plainToClass } from 'class-transformer';

class LoanDataSource extends MatTableDataSource<Loan> {
  showReturned = false;

  filterPredicate: ((data: Loan, filter: string) => boolean) = (data: Loan, filter: string): boolean => {
    const transformedFilter = filter.trim().toLowerCase();
    const result = data.filterString().indexOf(transformedFilter) !== -1;
    return result;
  }

}

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})
export class LoanComponent implements OnInit, AfterViewInit {
  _isNavSetup = false;
  _loading = false;
  _error = '';
  _editDisabled = true;
  _returnDisabled = true;
  _loanSource: Loan[];
  _data: LoanDataSource;
  _displayAll = false;
  _filterString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Loan>;

  constructor(
    private _loanSvc: LoanService,
    private _dialog: MatDialog
  ) { }

  applyFilter(filter: string) {
    filter = filter.trim();
    filter = filter.toLowerCase();
    this._filterString = filter;
    this._data.filter = filter;
  }

  displayAll() {
    this._displayAll = !this._displayAll;
    this.displayLoans();
  }

  editRow(row: Loan) {
    this.editLoan(row);
  }

  displayLoans() {
    if (this._displayAll) {
      this._data = new LoanDataSource(this._loanSource);
    } else {
      this._data = new LoanDataSource(this._loanSource.filter(e => !e.enddate ));
    }
    this.checkButtons();
    this._data.filter = this._filterString;
  }

  getLoans() {
    this._loanSvc.getLoans()
      .subscribe(
        res => {
          this._loanSource = res;
          this.displayLoans();
        },
        err => this.errorHandler(err),
        () => {
          this._loading = false;
          this._data.paginator = this.paginator;
          this._data.sort = this.sort;
        }
      );
  }

  ngOnInit() {
    this._loanSvc.setupNav();
    this._loading = true;
    this.getLoans();
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  newLoan() {
    const dialogRef = this._dialog.open(LoanDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      const loan = <Loan>result;
      if (loan) {
        this._loanSvc.newLoan(loan)
          .subscribe(
            savedLoan => this.displayLoan(savedLoan),
            err => this.errorHandler(err)
          );
      }
    });
  }

  returnLoan() {
    const l = this._loanSource.find(e => e.selected);
    if (l) {
      const dialogRef = this._dialog.open(ReturnDialogComponent, { width: '400px'});
      dialogRef.componentInstance.loan = Object.assign({}, l);

      dialogRef.afterClosed().subscribe((result: Loan) => {
        if (result) {
          this._loanSvc.editLoan(result)
            .subscribe(
              res => {
                if (res) {
                  l.enddate = result.enddate;
                  this.displayLoans();

                } else { this.errorHandler('error - unable to return loan'); }
              },
              err => this.errorHandler(err)
            );
        }
      });
    }
  }

  editLoan(l?: Loan) {
    if (!l) { l = this._loanSource.find(e => e.selected); }
    if (l) {
      const dialogRef = this._dialog.open(EditDialogComponent, {
        width: '400px'
      });
      dialogRef.componentInstance.loan = Object.assign({}, l);
      dialogRef.afterClosed().subscribe((result: Loan) => {
        if (result) {
          this._loanSvc.editLoan(result)
            .subscribe(
              res => {
                if (res) {
                  result.selected = false;
                  this._loanSource.splice(this._loanSource.indexOf(l), 1, result);
                  this.displayLoans();
                } else { this.errorHandler('The loan was not updated, please see the server logs'); }
              },
              err => this.errorHandler(err)
            );
        }
      });
    }
  }

  selectRow(row: any) {
    row.selected = !row.selected;
    this.checkButtons();
  }

  checkButtons() {
    let count = 0;
    for (const v of this._data.data) {
      if (v.selected) { count++; }
    }
    if (count !== 1) { this._editDisabled = true; } else { this._editDisabled = false; }
    if (count > 0) { this._returnDisabled = false; } else { this._returnDisabled = true; }
  }

  displayLoan(l: Loan) {
    const a = this._data.data;
    a.push(l);
    this._data.data = a;
    // this._data.data.push(l);
    // this.table.renderRows();
    // this.paginator.firstPage();
    this.paginator.lastPage();
  }

  errorHandler(error: any) {
    console.error('Error in loan component: ' + error.message || error);
    this._error = error.message || error;
  }
}
