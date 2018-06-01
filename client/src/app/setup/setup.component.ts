import { Component, OnInit } from '@angular/core';
import { SetupService } from './setup.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  private _isNavSetup = false;

  constructor( private _setupSvc: SetupService ) { }

  ngOnInit() {
    this._setupSvc.setupNav();
  }
}
