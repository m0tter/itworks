import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { MatButtonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import 'reflect-metadata';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SideNavComponent } from './side-nav/side-nav.component';

import { NavService } from './services/nav.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthCallbackComponent } from './auth/auth-callback.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideNavComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    NavService,
    UserService,
    {provide: LOCALE_ID, useValue: 'en-AU'},
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
