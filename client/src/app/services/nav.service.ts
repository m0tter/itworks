import { Injectable } from '@angular/core';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { SideNavItem } from '../_types';

@Injectable()
export class NavService {
  public sideNav: SideNavComponent;

  constructor() { this.setNavItems([]); }

  hide(): void {
    if (this.sideNav) { this.sideNav.visible = false; }
  }

  show(): void {
    if (this.sideNav) { this.sideNav.visible = true; }
  }

  setNavItems(items: SideNavItem[]) {
    if (this.sideNav) { this.sideNav.navItems = items; }
  }
}
