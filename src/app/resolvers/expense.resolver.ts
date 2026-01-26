import { Injectable } from '@angular/core';
import { ExpenseService } from '../services/expenses-service';
import { Resolve } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { CategoryService } from '../services/category-service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseResolver implements Resolve<boolean> {
  constructor(private expenseService: ExpenseService, private categoryService: CategoryService) {}

  resolve() {
    return forkJoin([
        this.expenseService.getExpenses(), 
        this.expenseService.loadExpense(),
        this.categoryService.getCategories()
    ]).pipe(
      map(() => true),
    );
  }
}
