import { ToastrService } from 'ngx-toastr';
import { AccountPayload } from '../../../model/app.model';
import { AccountService } from '../../../service/account.service';
import { ErrorMatcher } from '../../../shared/utils/error-matcher';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
})
export class AccountDialogComponent implements OnInit {
  accountForm: FormGroup;
  accountPayload: AccountPayload;
  errorMatcher = new ErrorMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AccountDialogComponent>,
    private builder: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountForm = this.builder.group({
      id: '',
      name: ['', Validators.required],
      openingBalance: [0, [Validators.required, Validators.min(0)]],
      description: '',
    });

    // edit
    if (data.account) {
      this.accountForm.patchValue(data.account);
    }
  }

  ngOnInit(): void {}

  save() {
    this.accountPayload = this.accountForm.value;

    if (this.accountForm.value.id) {
      this.accountService
        .update(this.accountForm.value.id, this.accountPayload)
        .subscribe({
          next: (_) => {
            this.accountForm.reset();
            this.toastr.success('Successfully Updated');
            this.dialogRef.close('edit');
          },
          error: (error) => {
            this.toastr.error(error.error.message);
          },
        });
    } else {
      this.accountService.createAccount(this.accountPayload).subscribe({
        next: (_) => {
          this.accountForm.reset();
          this.toastr.success('Successfully Created');
          this.dialogRef.close('save');
        },
        error: (error) => {
          this.toastr.error(error.error.message);
        },
      });
    }
  }
}
