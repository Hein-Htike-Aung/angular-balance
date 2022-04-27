import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicModule } from './../public/public.module';
import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { CategoryComponent } from './category/category.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountDialogComponent } from './account/account-dialog/account-dialog.component';
import { CategoryDialogComponent } from './category/category-dialog/category-dialog.component';
import { TrackBudgetComponent } from './track-budget/track-budget.component';

@NgModule({
  declarations: [
    CategoryComponent,
    AccountComponent,
    DashboardComponent,
    AccountDialogComponent,
    CategoryDialogComponent,
    TrackBudgetComponent,
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    MaterialModule,
    PublicModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule
  ],
})
export class MasterModule {}
