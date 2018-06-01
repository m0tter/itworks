import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SetupService } from '../setup.service';
import { DeviceTypeService } from './device-type.service';
import { DeviceType, DeviceModel } from '../../_types';
import { YesNoDialogComponent } from '../../common/dialogs';
import { OKDialogComponent } from '../../common/dialogs';
import { DeviceTypeDialogComponent } from './device-type-dialog.component';

@Component({
  selector: 'app-device-types',
  templateUrl: 'device-type.component.html',
  styleUrls: ['device-type.component.scss']
})
export class DeviceTypeComponent implements OnInit {
  private _types: DeviceType[];
  private _error: string;
  private _loading = true;
  private _prevValue: string;
  private _editing = false;
  private _adding = false;

  constructor(
    private _setupSvc: SetupService,
    private _typeSvc: DeviceTypeService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this._setupSvc.showNav();
    this._typeSvc.getTypes().subscribe(
      res => this._types = res,
      err => this.errorHandler(err),
      () => this._loading = false
    );
  }

  errorHandler(error: any) {
    console.error('Error in setup device-type component: ' + error.message || error);
    this._error = error.message || error;
  }

  newType() {
    const dialog = this._dialog.open(DeviceTypeDialogComponent, { width: '350px' });
    dialog.afterClosed().subscribe(
      res => {
        if (res && true) {
          const t = new DeviceType();
          t.type = res;
          this._typeSvc.addType(t).subscribe(
            addRes => {
              if (addRes) {
                this._types.push(addRes);
              }
            },
            err => this.errorHandler(err)
          );
        }
      },
      err => this.errorHandler(err)
    );
  }

  editModel(model: DeviceModel) {
    if (!this._editing) {
      model.edit = true;
      this._prevValue = model.model;
      this._editing = true;
    } else {
      this.displayOKDialog('Can only edit one record at a time');
    }
  }

  cancelModelEdit(model: DeviceModel, type: DeviceType) {
    if (this._adding) {
      const dialog = this._dialog.open(YesNoDialogComponent, {
        data: 'Cancelling will remove your new entry, do you want to cancel?', width: '350px'
      });
      dialog.afterClosed().subscribe(
        res => {
          if (res && true) {
            type.models.splice(type.models.lastIndexOf(model), 1);
            this._adding = false;
          }
        },
        err => this.errorHandler(err)
      );
    } else {
      model.edit = false;
      model.model = this._prevValue;
      this._editing = false;
      this._prevValue = null;
    }
  }

  saveModel(model: DeviceModel, type: DeviceType) {
    if (this._adding) {
      this._typeSvc.addModel(model).subscribe(
        res => {
          if (res) {
            model.id = res.id;
            this.completeEdit(model);
          } else {
            this.errorHandler('Error adding a new model, please see logs');
          }
        },
        err => this.errorHandler(err),
      );
    } else {
      this._typeSvc.editModel(model).subscribe(
        res => {
          if (res && true) {
            this.completeEdit(model);
          } else {
            this.errorHandler('Error saving, please see logs');
          }
        },
        err => this.errorHandler(err),
      );
    }
  }

  deleteModel(model: DeviceModel, type: DeviceType) {
    const ynDialog = this._dialog.open(YesNoDialogComponent, {
      data: `Are you sure you want to delete the model ${model.model}?`, width: '350px'
    });
    ynDialog.afterClosed().subscribe(
      dialogRes => {
        if (dialogRes && true) {
          this._typeSvc.deleteModel(model).subscribe(
            res => {
              if (res) {
                type.models.splice(type.models.indexOf(model), 1);
              }
            },
            err => {
              if (err.message === 'existing') {
                this.displayOKDialog('The model is still in use and can not be deleted');
              }
              console.log('err=' + JSON.stringify(err.message));
            }
          );
        }
      }
    );
  }

  completeEdit(model?: DeviceModel) {
    this._adding = false;
    this._editing = false;
    this._prevValue = null;
    if (model) { model.edit = false; }
  }

  displayOKDialog(msg: string) {
    const okDialog = this._dialog.open(OKDialogComponent, {
      data: msg, width: '350px' });
  }

  addModel(device: DeviceType) {
    if (!this._editing) {
      this._adding = true;
      const m = device.newModel();
      m.edit = true;
    } else {
      this.displayOKDialog('Cancel edit before attempting to create a new model');
    }

  }

  focusInput(el: any) {
    console.log('el: ' + JSON.stringify(el));
  }
}
