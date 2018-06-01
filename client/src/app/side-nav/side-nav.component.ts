import { Component, OnInit } from '@angular/core';

import { NavService } from '../services/nav.service';
import { SideNavItem } from '../_types';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  navItems: SideNavItem[];
  public visible = false;

  constructor( private navService: NavService ) { }

  ngOnInit() {
    this.navService.sideNav = this;
  }
}
