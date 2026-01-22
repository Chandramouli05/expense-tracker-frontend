import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EMI } from '../models/emi.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EMIService {
  private apiLink = environment.apiUrl + '/emi';
  private emiSignal = signal<EMI[]>([]);
  readonly emi = this.emiSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getEMI() {
    return this.http.get<EMI[]>(`${this.apiLink}`).pipe(
      tap({
        next: (emis) => {
          this.emiSignal.set(emis);
        },
        error: (err) => this.emiSignal.set(err),
      })
    );
  }

  getStatusDate() {
    return this.http
      .get<EMI[]>(`${this.apiLink}`)
      .pipe(map((res) => res.map((val) => val.date)))

  }

  createEMI(emi: EMI) {
    return this.http.post<EMI>(`${this.apiLink}`, emi).pipe(
      tap((newEMI) => {
        this.emiSignal.update((prev) => [...prev, newEMI]);
      })
    );
  }

  updateEMI(_id: string, emi: EMI) {
    return this.http.put<EMI>(`${this.apiLink}/${_id}`, emi).pipe(
      tap((updatedEMI) => {
        this.emiSignal.update((prev) =>
          prev.map((e) => (e._id === updatedEMI._id ? updatedEMI : e))
        );
      })
    );
  }

  deleteEMI(_id: string) {
    return this.http.delete<{ message: string; _id: string }>(`${this.apiLink}/${_id}`).pipe(
      tap(() => {
        this.emiSignal.update((prev) => prev.filter((cat) => cat._id !== _id));
      })
    );
  }
}
