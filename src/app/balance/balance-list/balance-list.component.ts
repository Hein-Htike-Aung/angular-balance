import { FormControl, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { BalanceDialogComponent } from './balance-dialog/balance-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BalanceService } from './../../service/balance.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BalancePayload, BalanceType } from './../../model/app.model';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.scss']
})
export class BalanceListComponent implements OnInit, OnChanges {

  @Input() balances: BalancePayload[];
  @Input() balanceListInfo: string;
  origianlBalances: BalancePayload[];

  @Output() onDelete = new EventEmitter();
  @Output() onEdit = new EventEmitter();

  dateRangeForm: FormGroup;
  totalAmount: number;

  balancesDataSource!: MatTableDataSource<BalancePayload>;
  displayColumns: string[] = ['name', 'amount', 'category', 'account', 'date', 'description', 'action']

  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  /* In order to work Pagination */
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.balancesDataSource.paginator = this.paginator;
    this.balancesDataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.filter('');
    }
  }

  constructor(private dialog: MatDialog, private balanceService: BalanceService, private builder: FormBuilder) {
    this.dateRangeForm = this.builder.group({
      dateFrom: '',
      dateTo: ''
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshBalanceList();
    this.origianlBalances = this.balances;
  }

  refreshBalanceList() {
    if (this.balances.length !== 0) {
      this.balances = this.balances.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
    this.totalAmount = this.balances.reduce((sum, { amount }) => sum + amount, 0);
    this.balancesDataSource = new MatTableDataSource(this.balances);
    this.balancesDataSource.sort = this.sort;
    this.balancesDataSource.paginator = this.paginator;
  }

  filter(filterValue: string) {
    this.balancesDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.balancesDataSource.paginator) {
      this.balancesDataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
  }

  delete(balancePayload: BalancePayload) {
    this.onDelete.emit(balancePayload);
  }

  edit(balancePayload: BalancePayload) {

    this.dialog.open(BalanceDialogComponent, {
      data: {
        balance: balancePayload,
        balanceInfo: this.balanceListInfo
      }
    })
      .afterClosed()
      .subscribe(() => {
        if (this.balanceListInfo == BalanceType.INCOME) {
          this.balanceService.getAll("account&category").subscribe(resp => {
            this.balances = resp.filter(b => b.balanceType === BalanceType.INCOME);
            this.refreshBalanceList();
          });
        } else {
          this.balanceService.getAll("account&category").subscribe(resp => {
            this.balances = resp.filter(b => b.balanceType === BalanceType.EXPENSE);
            this.refreshBalanceList();
          });
        }
      });

  }

  dateSearch() {
    let dateF: Date, dateT: Date;

    if (this.dateRangeForm.value.dateFrom) {
      dateF = new Date(this.dateRangeForm.value.dateFrom);
    }
    if (this.dateRangeForm.value.dateTo) {
      dateT = new Date(this.dateRangeForm.value.dateTo);
    }

    this.balances = this.origianlBalances.filter(b => {
      const actualDate = new Date(b.date);

      return actualDate >= dateF && actualDate <= dateT;
    });

    this.refreshBalanceList();

  }
}
