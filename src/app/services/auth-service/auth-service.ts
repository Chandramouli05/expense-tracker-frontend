import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiLink = environment.apiUrl + '/auth';

  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();

  constructor(private http: HttpClient) {}

  signup(data: User) {
    return this.http.post(`${this.apiLink}/signup`, data);
  }

  login(data: User) {
    return this.http
      .post<{
        accessToken: string;
        user: User;
      }>(`${this.apiLink}/login`, data, { withCredentials: true })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
          this.userSignal.set(res.user);
        }),
      );
  }

  getUser() {
    return this.http.get<User>(`${this.apiLink}/getuser`).pipe(
      tap({
        next: (user) => this.userSignal.set(user),
        error: () => this.userSignal.set(null),
      }),
    );
  }

  refreshToken() {
    return this.http
      .post<{ accessToken: string }>(`${this.apiLink}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
        }),
      );
  }

  logout() {
    return this.http.post(`${this.apiLink}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        this.userSignal.set(null);
      }),
    );
  }
}
