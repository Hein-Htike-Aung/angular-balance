import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountPayload } from './../../model/app.model';
import { AccountService } from './../../service/account.service';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {  

  accounts: AccountPayload[] = [];
  accountsDataSource!: MatTableDataSource<AccountPayload>;
  displayedColumns: string[] = [
    'name',
    'openingBalance',
    'description',
    'action',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.getAllAccounts();
  }

  ngOnInit(): void {}

  
  filter(filterValue: string) {
    this.accountsDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.accountsDataSource.paginator) {
      this.accountsDataSource.paginator.firstPage();
    }
  }

  getAllAccounts() {
    this.accountService.getAll().subscribe({
      next: (resp) => {
        this.accounts = resp.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
        this.accountsDataSource = new MatTableDataSource(this.accounts);
        this.accountsDataSource.sort = this.sort;
        this.accountsDataSource.paginator = this.paginator;
      },
      error: (error) => this.toastr.error(error.message),
    });
  }

  addNew() {
    this.dialog
      .open(AccountDialogComponent, {
        data: {
          title: 'Add New Account',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'save') {
          this.getAllAccounts();
        }
      });
  }

  edit(account: AccountPayload) {
    this.dialog
      .open(AccountDialogComponent, {
        data: {
          title: 'Edit Account',
          account,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'edit') {
          this.getAllAccounts();
        }
      });
  }

  delete(account: AccountPayload) {
    this.snackBar
      .open(`Are you sure want to delete ${account.name}?`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn'],
      })
      .onAction()
      .subscribe(() => {
        if (account) {
          this.accountService.delete(account.id!).subscribe({
            next: (_) => {
              this.getAllAccounts();
            },
            error: (error) => {
              this.toastr.error(error.error.message);
            },
          });
        }
      });
  }

}
