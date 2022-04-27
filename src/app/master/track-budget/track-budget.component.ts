import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryPayload, CategoryVO } from './../../model/app.model';
import { CategoryService } from './../../service/category.service';

@Component({
  selector: 'app-tract-budget',
  templateUrl: './track-budget.component.html',
  styleUrls: ['./track-budget.component.scss']
})
export class TrackBudgetComponent implements OnInit {

  categories: CategoryPayload[] = [];
  categoriesDataSource: MatTableDataSource<CategoryVO>;
  displayColumns: string[] = ['category', 'subcategory', 'amount', 'date'];
  dateRangeForm: FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private categoryService: CategoryService, private builder: FormBuilder) {

    this.getAllCategoriesWithBalance();
  }

  ngOnInit(): void {
    this.dateRangeForm = this.builder.group({
      dateFrom: '',
      dateTo: ''
    });
  }

  filter(filterValue: string) {
    this.categoriesDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.categoriesDataSource.paginator) {
      this.categoriesDataSource.paginator.firstPage();
    }
  }

  getAllCategoriesWithBalance() {
    this.prepareCategoryData();
  }

  dateSearch() {
    let dateF: Date, dateT: Date;

    if (this.dateRangeForm.value.dateFrom) {
      dateF = new Date(this.dateRangeForm.value.dateFrom);
    }
    if (this.dateRangeForm.value.dateTo) {
      dateT = new Date(this.dateRangeForm.value.dateTo);
    }

    this.prepareCategoryData(dateF!, dateT!);

  }

  prepareCategoryData(dateF?: Date, dateT?: Date) {
    this.categoryService.getAll('balances').subscribe(resp => {
      this.categories = resp;

      let targetCategories: CategoryVO[] = [];

      this.categories.forEach(c => {
        let sum = 0;
        if (c.balances.length !== 0) {
          c.balances.forEach(cb => {

            if (dateF && dateT) {
              const actualDate = new Date(cb.date);

              if (actualDate >= dateF && actualDate <= dateT) {

                sum += cb.amount;
              }
            } else {
              sum += cb.amount;
            }

          });
          targetCategories.push({
            category: c.name,
            subcategory: c.parentCategory?.name,
            amount: sum,
            type: c.type
          });
        }
      });

      this.categoriesDataSource = new MatTableDataSource(targetCategories.sort((a, b) => a.type.localeCompare(b.type)));
      this.categoriesDataSource.sort = this.sort;
      this.categoriesDataSource.paginator = this.paginator;
    })
  }

}
