import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthCallbackComponent } from './auth/auth-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'setup', loadChildren: './setup/setup.module#SetupModule'},
  { path: 'loan', loadChildren: './loan/loan.module#LoanModule'},
  { path: 'callback', component: AuthCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
