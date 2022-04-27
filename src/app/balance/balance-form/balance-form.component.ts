import { ToastrService } from 'ngx-toastr';
import { BalancePayload, BalanceType, CategoryPayload, AccountPayload, CategoryType } from './../../model/app.model';
import { Router } from '@angular/router';
import { AccountService } from './../../service/account.service';
import { CategoryService } from './../../service/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMatcher } from './../../shared/utils/error-matcher';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Component({
  selector: 'app-balance-form',
  templateUrl: './balance-form.component.html',
  styleUrls: ['./balance-form.component.scss']
})
export class BalanceFormComponent implements OnInit, AfterViewInit {

  @Input() title?: string;
  @Output() onSubmit = new EventEmitter();
  @Output() balanceType = new EventEmitter();

  balanceForm: FormGroup;
  balancePayload: BalancePayload;
  categories: CategoryPayload[] = [];
  accounts: AccountPayload[] = [];

  errorMatcher = new ErrorMatcher();

  constructor(
    private builder: FormBuilder,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.balanceForm = this.builder.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
      accountId: ['', Validators.required],
      date: ['', Validators.required],
      description: '',
    })

  }
  ngAfterViewInit(): void {
    if (this.title === 'Income') {
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

    this.accountService.findById(this.balanceForm.value.accountId).subscribe(acc => {
      if (acc.openingBalance < this.balanceForm.value.amount && this.title == 'Expense') {
        this.toastr.error('Account don\'t have enough balance');
      } else {
        this.balancePayload = this.balanceForm.value;
        if (this.title === 'Income') {
          this.balancePayload.balanceType = BalanceType.INCOME;
          this.router.navigateByUrl("/balance/income");
        } else {
          this.balancePayload.balanceType = BalanceType.EXPENSE;
          this.router.navigateByUrl("/balance/expense");
        }
        this.onSubmit.emit(this.balancePayload);
      }
    })



  }

}
