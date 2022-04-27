import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryPayload } from './../../model/app.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from './../../service/category.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: CategoryPayload[] = [];
  categoriesDataSource: MatTableDataSource<CategoryPayload>;
  displayColumns: string[] = ['name', 'type', 'description', 'parentCategory', 'action'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.getAllCategory();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.categoriesDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.categoriesDataSource.paginator) {
      this.categoriesDataSource.paginator.firstPage();
    }
  }

  getAllCategory() {
    this.categoryService.getAll().subscribe({
      next: (resp) => {        
        this.categories = resp.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

        this.categoriesDataSource = new MatTableDataSource(this.categories);
        this.categoriesDataSource.sort = this.sort;
        this.categoriesDataSource.paginator = this.paginator;
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }

  addNew() {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          title: 'Add New Category',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'save') {
          this.getAllCategory();
        }
      });
  }

  edit(category: CategoryPayload) {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          title: 'Edit Category',
          category,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'edit') {
          this.getAllCategory();
        }
      });
  }

  delete(category: CategoryPayload) {
    this.snackBar
      .open(`Are you sure want to delete ${category.name}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn'],
      })
      .onAction()
      .subscribe(() => {
        this.categoryService.delete(category.id!).subscribe({
          next: (_) => {
            this.getAllCategory();
          },
          error: (error) => {
            this.toastr.error(error.error.message);
          },
        });
      });
  }
}
