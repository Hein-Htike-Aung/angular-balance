import { CategoryService } from './../../../service/category.service';
import { AccountService } from './../../../service/account.service';
import { ErrorMatcher } from './../../../shared/utils/error-matcher';
import { BalancePayload, AccountPayload, CategoryPayload, CategoryType } from './../../../model/app.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BalanceService } from './../../../service/balance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-balance-dialog',
  templateUrl: './balance-dialog.component.html',
  styleUrls: ['./balance-dialog.component.scss']
})
export class BalanceDialogComponent implements OnInit {

  accounts: AccountPayload[] = [];
  categories: CategoryPayload[] = [];
  balanceForm: FormGroup;
  balancePayload: BalancePayload;
  errorMatcher = new ErrorMatcher();

  constructor(
    private builder: FormBuilder,
    private balanceService: BalanceService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BalanceDialogComponent>
  ) {
    this.balanceForm = this.builder.group({
      id: '',
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
      accountId: ['', Validators.required],
      date: ['', Validators.required],
      description: '',
    });

    if (data.balance) {
      this.balanceForm.patchValue(data.balance);
    }

    // Categories & Accounts
    if (this.data.balanceInfo === 'INCOME') {
      this.categoryService.getAll().subscribe(resp => this.categories = resp.filter(c => {

        c.subcategories = c.subcategories?.filter(sc => sc.type === CategoryType.INCOME);

        return c.type === CategoryType.INCOME;

      }));
    } else {
      this.categoryService.getAll().subscribe(resp => this.categories = resp.filter(c => {
        c.subcategories = c.subcategories?.filter(sc => sc.type === CategoryType.EXPENSE);

        return c.type === CategoryType.EXPENSE;
      }));
    }

    this.accountService.getAll().subscribe(resp => this.accounts = resp);
  }

  ngOnInit(): void {

  }

  save() {
    this.balancePayload = this.balanceForm.value;
    this.balanceService.update(this.balanceForm.value.id, this.balancePayload).subscribe({
      next: (resp) => {
        this.toastr.success('Successully updated')
        this.balanceForm.reset();
        this.dialogRef.close();
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }
    })
  }

}
