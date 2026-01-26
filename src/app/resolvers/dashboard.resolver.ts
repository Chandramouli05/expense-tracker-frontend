import { Injectable } from '@angular/core';
import { IncomeService } from '../services/income-service';
import { ExpenseService } from '../services/expenses-service';
import { SavingsService } from '../services/savings-service';
import { EMIService } from '../services/emi-service';
import { CategoryService } from '../services/category-service';
import { forkJoin, map } from 'rxjs';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolver implements Resolve<boolean> {
  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private savingsService: SavingsService,
    private emiService: EMIService,
    private categoryService: CategoryService,
  ) {}

  resolve() {
    return forkJoin([
      this.incomeService.loadIncome(),
      this.expenseService.loadExpense(),
      this.expenseService.getExpenses(),
      this.savingsService.loadSavings(),
      this.categoryService.getCategories(),
      this.emiService.getEMI(),
    ]).pipe(map(() => true));
  }
}
