import { ExpenseComponent } from './expense/expense.component';
import { IncomeComponent } from './income/income.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalanceComponent } from './balance.component';
import { LoginGuard } from '../shared/guards/login.guard';

const routes: Routes = [
  { path: '', component: BalanceComponent, canActivate: [LoginGuard] },
  { path: 'income', component: IncomeComponent, canActivate: [LoginGuard] },
  { path: 'expense', component: ExpenseComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceRoutingModule {}
