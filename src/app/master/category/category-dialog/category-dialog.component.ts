import { ToastrService } from 'ngx-toastr';
import { CategoryService } from './../../../service/category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMatcher } from './../../../shared/utils/error-matcher';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryPayload } from './../../../model/app.model';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
  categoryPayload: CategoryPayload;
  categoryForm: FormGroup;
  errorMatcher = new ErrorMatcher();
  categories: CategoryPayload[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private builder: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.builder.group({
      id: '',
      name: ['', Validators.required],
      type: ['', Validators.required],
      parentCategoryId: '',
      description: '',
    });

    
    if (data.category) {
      this.categoryForm.patchValue(data.category);
      this.categoryService.getAll().subscribe(resp => this.categories = resp.filter(c => c.id !== data.category.id));
    }else {      
      this.categoryService.getAll().subscribe(resp => this.categories = resp);
    }
  }

  ngOnInit(): void {}

  save() {
    this.categoryPayload = this.categoryForm.value;

    if (this.categoryForm.value.id) {
      this.categoryService
        .update(this.categoryForm.value.id, this.categoryPayload)
        .subscribe({
          next: (_) => {
            this.toastr.success('Successfully updated');
            this.dialogRef.close('edit');
          },
          error: (error) => {
            this.toastr.error(error.error.message);
          },
        });
    } else {
      this.categoryService.create(this.categoryPayload).subscribe({
        next: (_) => {
          this.toastr.success('Successfully created');
          this.dialogRef.close('save');
        },
        error: (error) => {
          this.toastr.error(error.error.message);
        },
      });
    }
  }
}
