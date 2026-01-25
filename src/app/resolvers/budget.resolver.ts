import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IncomeService } from '../services/income-service';
import { ExpenseService } from '../services/expenses-service';
import { CategoryService } from '../services/category-service';
import { EMIService } from '../services/emi-service';
import { forkJoin, map } from 'rxjs';
import { SavingsService } from '../services/savings-service';

@Injectable({
  providedIn: 'root',
})
export class BudgetResolver implements Resolve<boolean> {
  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private savingsService: SavingsService,
    private emiService: EMIService,
  ) {}

  resolve() {
    return forkJoin([
      this.incomeService.loadIncome(),
      this.incomeService.getIncome(),
      
      this.expenseService.getExpenses(),
      this.expenseService.loadExpense(),
      this.savingsService.loadSavings(),
      this.categoryService.getCategories(),
      this.emiService.getEMI(),
    ]).pipe(map(() => true));
  }
}
