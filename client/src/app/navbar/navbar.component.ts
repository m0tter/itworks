import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(private _auth: AuthService) { }

  isLoggedIn(): boolean {
    return false;
  }

  login(): void {
    this._auth.login();
  }

  logout(): void {
    this._auth.logout();
  }

  ngOnInit() {  }

  ngOnDestroy() {  }

  errorHandler(msg: string) {
    console.log('Error in navbar.component.ts:' + msg);
  }
}
