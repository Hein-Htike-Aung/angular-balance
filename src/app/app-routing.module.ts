import { LoginGuard } from './shared/guards/login.guard';
import { UserProfileComponent } from './public/user-profile/user-profile.component';
import { SigninComponent } from './public/signin/signin.component';
import { SignupComponent } from './public/signup/signup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'sign-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [LoginGuard] },
  { path: '', component: SigninComponent, pathMatch: 'full' },
  {
    path: 'master',
    loadChildren: () =>
      import('./master/master.module').then((m) => m.MasterModule),
  },
  {
    path: 'balance',
    loadChildren: () =>
      import('./balance/balance.module').then((m) => m.BalanceModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
