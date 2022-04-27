import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicModule } from './../public/public.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { BalanceFormComponent } from './balance-form/balance-form.component';
import { MaterialModule } from '../material.module';
import { BalanceListComponent } from './balance-list/balance-list.component';
import { BalanceDialogComponent } from './balance-list/balance-dialog/balance-dialog.component';


@NgModule({
  declarations: [
    BalanceComponent,
    IncomeComponent,
    ExpenseComponent,
    BalanceFormComponent,
    BalanceListComponent,
    BalanceDialogComponent
  ],
  imports: [
    CommonModule,
    BalanceRoutingModule,
    PublicModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BalanceModule { }
