import { AccountService } from './../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { BalanceService } from './../service/balance.service';
import { BalancePayload, AccountPayload, BalanceType } from './../model/app.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  balancePayload: BalancePayload;

  constructor(private balanceService: BalanceService, private toastr: ToastrService, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  save(balancePayload: BalancePayload) {
    this.balanceService.create(balancePayload).subscribe({
      next: (resp) => {

        this.accountService.findById(resp['accountId']).subscribe(ac => {
          let account: AccountPayload = ac;
          if (balancePayload.balanceType === BalanceType.INCOME) {
            this.accountService.update(resp['accountId'], { openingBalance: account.openingBalance + resp['amount'] }).subscribe();
          }
          if (balancePayload.balanceType === BalanceType.EXPENSE) {
            this.accountService.update(resp['accountId'], { openingBalance: account.openingBalance - resp['amount'] }).subscribe();
          }
          this.toastr.success(`Your ${balancePayload.balanceType} is successfully created`);
        })

      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }
    })
  }

}
