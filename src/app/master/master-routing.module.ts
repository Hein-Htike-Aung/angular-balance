import { LoginGuard } from './../shared/guards/login.guard';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackBudgetComponent } from './track-budget/track-budget.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [LoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [LoginGuard] },
  { path: 'track-budget', component: TrackBudgetComponent, canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
