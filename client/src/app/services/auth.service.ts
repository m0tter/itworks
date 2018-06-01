import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import Auth0Lock from 'auth0-lock';
import { AUTH_CALLBACK, AUTH_CLIENTCODE } from '../_config';


@Injectable()
export class AuthService {

  lock = new Auth0Lock(AUTH_CLIENTCODE, 'itworks.au.auth0.com', {
    autoclose: true,
    auth: {
      redirectUrl: AUTH_CALLBACK,
      responseType: 'token id_token',
      audience: 'https://itworks.au.auth0.com/userinfo',
      params: { scope: 'openid' }
    },
    allowedConnections: ['GSLC']
  });

  constructor(public router: Router) { }

  public login(): void {
    this.lock.show();
  }

  public handleAuthentication(): void {
    this.lock.on('authenticated', (authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.navigate(['/']);
      }
    });
    this.lock.on('authorization_error', (err) => {
      this.router.navigate(['/']);
      this.errorHandler(err);
    });
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  private errorHandler(err: any) {
    console.error('An error occurred in the auth service. ' + err.message || JSON.stringify(err));
    throw new Error(err.message || JSON.stringify(err));
  }
}
