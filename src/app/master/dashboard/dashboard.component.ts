import { AccountService } from './../../service/account.service';
import { CategoryService } from './../../service/category.service';
import { BalancePayload, BalanceType, CategoryPayload, CategoryType } from './../../model/app.model';
import { BalanceService } from './../../service/balance.service';
import { Component, OnInit } from '@angular/core';
import { GoogleChart } from '../../model/app.model';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  openSidebar = true;
  date: string;
  month: string;
  year: number;
  incomes: BalancePayload[];
  expenses: BalancePayload[];
  incomesForTransaction: BalancePayload[];
  expensesForTransaction: BalancePayload[];

  incomeAndExpenseLinesChart: GoogleChart;
  incomeByCategoryPieChart: GoogleChart;
  expenseByCategoryPieChart: GoogleChart;
  accountBalanceBarChart: GoogleChart;
  currentMonthIncome: number;
  currentMonthExpense: number;
  totalBalance: number;
  readonly months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(private balanceService: BalanceService, private categoryService: CategoryService, private accountService: AccountService) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    this.year = today.getFullYear();
    this.month = today.toLocaleString('default', { month: 'long' });

    this.date = mm + '/' + dd + '/' + this.year;

    this.instantiateIncomeAndExpenseLineChart();
    this.instantiateIncomeByCategoryPieChart();
    this.instantiateExpenseByCategoryPieChart();
    this.instantiateaccountBalanceBarChart();

    this.balanceService.getAll().subscribe(resp => {
      const balances = resp;

      this.incomes = balances.filter(b => b.balanceType === BalanceType.INCOME);
      this.expenses = balances.filter(b => b.balanceType === BalanceType.EXPENSE);

      this.incomesForTransaction = [...this.incomes].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()).slice(0, 5);

      this.expensesForTransaction = [...this.expenses].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()).slice(0, 5);

      this.totalBalance = this.incomes.reduce((sum, { amount }) => sum + amount, 0);
      this.currentMonthIncome = this.incomes
        .filter(i => new Date(i.date).getMonth() == today.getMonth())
        .reduce((sum, { amount }) => sum + amount, 0);
      this.currentMonthExpense = this.expenses
        .filter(e => new Date(e.date).getMonth() == today.getMonth())
        .reduce((sum, { amount }) => sum + amount, 0);


    });


  }

  ngOnInit(): void {
  }

  instantiateIncomeByCategoryPieChart() {
    let pieChartData: [string, number][] = [];

    this.categoryService.getAll('balances').subscribe((resp: CategoryPayload[]) => {
      let sum = 0;
      resp.forEach(c => {
        if (c.type === CategoryType.INCOME && c.parentCategory != null) {
          if (c.balances.length != 0) {
            c.balances.forEach(cb => {
              sum += cb.amount;
            });
            pieChartData.push([c.name, sum]);
          }
        }

      });

      this.incomeByCategoryPieChart = {
        title: '',
        type: ChartType.PieChart,
        columns: ['', ''],
        data: pieChartData,
        options: {
          legend: {
            textStyle: { color: 'white' }
          },
          pieHole: 0.5,
          chartArea: {
            left: "0%",
            right: "0%",
            button: "0%",
            top: "0%",
            width: 200,
            height: 300
          },
          backgroundColor: "#303030",
        }
      };
    })
  }

  instantiateaccountBalanceBarChart() {
    let barChartData: [string, number, string][] = [];

    this.accountService.getAll().subscribe(resp => {
      resp.forEach(acc => {
        barChartData.push([acc.name, acc.openingBalance, '']);

        this.accountBalanceBarChart = {
          title: 'Monthly Income',
          type: ChartType.ColumnChart,
          columns: ['Months', 'Income', { role: 'style' }],
          data: barChartData,
          options: {
            chartArea: {
              left: "0%",
              right: "0%",
              button: "0%",
              top: "0%",
            },
            textStyle: { color: '#FFF' },
            legend: {
              textStyle: { color: 'white' }
            },
            backgroundColor: "#303030",
            hAxis: {
              title: '',
              textStyle: { color: 'white' }
            },
            vAxis: {
              title: '',
              textStyle: { color: 'white' }
            },
          }
        };
      });

    })
  }

  instantiateExpenseByCategoryPieChart() {
    let pieChartData: [string, number][] = [];

    this.categoryService.getAll('balances').subscribe((resp: CategoryPayload[]) => {
      let sum = 0;
      resp.forEach(c => {
        if (c.type === CategoryType.EXPENSE && c.parentCategory != null) {
          if (c.balances.length != 0) {
            c.balances.forEach(cb => {
              sum += cb.amount;
            });
            pieChartData.push([c.name, sum]);
          }
        }

      });

      this.expenseByCategoryPieChart = {
        title: '',
        type: ChartType.PieChart,
        columns: ['', ''],
        data: pieChartData,
        options: {
          // width: '100%',
          // height: '100%',
          legend: {
            textStyle: { color: 'white' }
          },
          colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
          pieHole: 0.5,
          chartArea: {
            left: "0%",
            right: "0%",
            button: "0%",
            top: "0%",
            width: 200,
            height: 300
          },
          backgroundColor: "#303030",
        }
      };
    })
  }

  instantiateIncomeAndExpenseLineChart() {

    let monthlyIncomes: number[] = [];
    let monthlyExpenses: number[] = [];
    let lineChartData: [string, number, number][] = [];

    this.balanceService.getAll().subscribe(resp => {
      const balances = resp;

      this.incomes = balances.filter(b => b.balanceType === BalanceType.INCOME);
      this.expenses = balances.filter(b => b.balanceType === BalanceType.EXPENSE);


      this.months.forEach((_, index) => {
        let totalIncome = 0;
        let totalExpense = 0;
        this.incomes.forEach(i => {
          if (new Date(i.date).getMonth() === index) {
            totalIncome = i.amount;
          }
        });
        this.expenses.forEach(e => {
          if (new Date(e.date).getMonth() === index) {
            totalExpense = e.amount;
          }
        });

        monthlyIncomes.push(totalIncome);
        monthlyExpenses.push(totalExpense);

      });

      this.months.forEach((month, index) => {
        lineChartData.push([month, monthlyIncomes[index], monthlyExpenses[index]]);
      });

      this.incomeAndExpenseLinesChart = {
        title: '',
        titleTextStyle: {
          color: "red",
        },
        type: ChartType.LineChart,
        data: lineChartData,
        columns: ['Months', 'Incomes', 'Expenses'],
        options: {
          chartArea: {
            left: "0%",
            right: "21%",
            button: "0%",
            top: "0%",
          },
          textStyle: { color: '#FFF' },
          legend: {
            textStyle: { color: 'white' }
          },
          backgroundColor: "#303030",
          hAxis: {
            title: 'Month',
            textStyle: { color: 'white' }
          },
          vAxis: {
            title: '',
            textStyle: { color: 'white' }
          },
        },
      };

    });

  }
}
