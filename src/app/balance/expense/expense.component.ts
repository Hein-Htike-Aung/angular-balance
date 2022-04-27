import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BalancePayload, BalanceType } from './../../model/app.model';
import { BalanceService } from './../../service/balance.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  balances: BalancePayload[] = [];

  constructor(private balanceService: BalanceService, private snackBar: MatSnackBar, private toastr: ToastrService) {
    this.getAllBalance();
  }

  ngOnInit(): void {
  }

  getAllBalance() {
    this.balanceService.getAll("account&category").subscribe(resp => this.balances = resp.filter(b => b.balanceType === BalanceType.EXPENSE));
  }

  delete(balancePayload: BalancePayload) {
    this.snackBar.open(`Are you sure want to delete ${balancePayload.name}`, 'OK', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['mat-toolbar', 'mat-warn']
    })
      .onAction()
      .subscribe(() => {
        this.balanceService.delete(balancePayload.id!).subscribe({
          next: (_) => {
            this.getAllBalance();
          },
          error: (error) => {
            this.toastr.error(error.error.message);
          }
        })
      });
  }

  edit(baalncePayload: BalancePayload) {
    
  }

}
