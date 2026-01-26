import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Income } from '../models/income.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiLink = environment.apiUrl + '/income';
  private incomeSignal = signal<Income[]>([]);
  readonly income = this.incomeSignal.asReadonly();

  private incomeRequest$?: Observable<Income[]>;

  constructor(private http: HttpClient) {}

  loadIncome() {
    if (!this.incomeRequest$) {
      this.incomeRequest$ = this.http.get<Income[]>(this.apiLink).pipe(
        tap((income) => this.incomeSignal.set(income)),
        shareReplay(1),
      );
    }
    return this.incomeRequest$;
  }

  getIncome() {
    return this.http.get<Income[]>(`${this.apiLink}`).pipe(
      tap({
        next: (income) => this.incomeSignal.set(income),
        error: (err) => this.incomeSignal.set(err),
      }),
    );
  }



  createIncome(exp: Income) {
    return this.http.post<Income>(`${this.apiLink}`, exp).pipe(
      tap((create) =>{
        this.incomeSignal.update((prev)=> [...prev, create])
      }
      ),
    );
  }

  updateIncome(exp: Income, _id: string) {
    return this.http.put<Income>(`${this.apiLink}/${_id}`, exp).pipe(
      tap((updateIncomes) => {
        this.incomeSignal.update((prev) =>
          prev.map((exp) => (exp._id === _id ? updateIncomes : exp)),
        );
      }),
    );
  }

  deleteIncome(_id: string) {
    return this.http.delete<Income>(`${this.apiLink}/${_id}`).pipe(
      tap({
        next: () => {
          this.incomeSignal.update((prev) => prev.filter((exp) => exp._id !== _id));
        },
        error: (err) => this.incomeSignal.set(err),
      }),
    );
  }
}
