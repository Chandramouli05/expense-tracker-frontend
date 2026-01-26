import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Savings } from '../models/savings.model';
import { Observable, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private apiLink = environment.apiUrl + '/savings';
  private savingSignal = signal<Savings[]>([]);
  readonly savings = this.savingSignal.asReadonly();

  private savingsRequest$?: Observable<Savings[]>;

  constructor(private http: HttpClient) {}

  loadSavings() {
    if (!this.savingsRequest$) {
      this.savingsRequest$ = this.http.get<Savings[]>(this.apiLink).pipe(
        tap((savings) => this.savingSignal.set(savings)),
        shareReplay(1),
      );
    }
    return this.savingsRequest$;
  }

  getSavings() {
    return this.http.get<Savings[]>(`${this.apiLink}`).pipe(
      tap({
        next: (savings) => this.savingSignal.set(savings),
        error: (err) => this.savingSignal.set(err),
      }),
    );
  }

  createSavings(exp: Savings) {
    return this.http.post<Savings>(`${this.apiLink}`, exp).pipe(
      tap((savings) => {
        this.savingSignal.update((prev) => [...prev, savings]);
      }),
    );
  }

  updateSavings(exp: Savings, _id: string) {
    return this.http
      .put<Savings>(`${this.apiLink}/${_id}`, exp)
      .pipe(
        tap((updateSaving) =>
          this.savingSignal.update((prev) =>
            prev.map((exp) => (exp._id === _id ? updateSaving : exp)),
          ),
        ),
      );
  }

  deleteSavings(_id: string) {
    return this.http.delete<Savings>(`${this.apiLink}/${_id}`).pipe(
      tap({
        next: () => {
          this.savingSignal.update((prev) => prev.filter((exp) => exp._id !== _id));
        },
        error: (err) => this.savingSignal.set(err),
      }),
    );
  }
}
