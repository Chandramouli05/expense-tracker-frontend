import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Expenses } from '../models/expense.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiLink = environment.apiUrl + '/expenses';
  private expensesSignal = signal<Expenses[]>([]);
  readonly expenses = this.expensesSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getExpenses() {
    return this.http.get<Expenses[]>(`${this.apiLink}`).pipe(
      tap({
        next: (expense) => this.expensesSignal.set(expense),
        error: (err) => this.expensesSignal.set(err),
      }),
    );
  }

  createExpenses(exp: Expenses) {
    return this.http.post<Expenses>(`${this.apiLink}`, exp).pipe(
      tap({
        next: (newExp) => this.expensesSignal.update((prev) => [...prev, newExp]),
        error: (err) => this.expensesSignal.set(err),
      }),
    );
  }

  updateExpenses(_id: string, expense: Expenses) {
    return this.http.put<Expenses>(`${this.apiLink}/${_id}`, expense).pipe(
      tap((updateExpense) => {
        this.expensesSignal.update((prev) => [...prev, updateExpense]);
      }),
    );
  }

  deleteExpenses(_id: string) {
    return this.http.delete<{ message: string }>(`${this.apiLink}/${_id}`).pipe(
      tap({
        next: () => {
          this.expensesSignal.update((prev) => prev.filter((exp) => exp._id !== _id));
        },
        error: (err) => console.error('Delete failed', err),
      }),
    );
  }
}
