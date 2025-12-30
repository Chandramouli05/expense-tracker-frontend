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
    return this.http.post<{ token: string; user: User }>(`${this.apiLink}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.userSignal.set(res.user);
      })
    );
  }

  getUser() {
    return this.http.get<User>(`${this.apiLink}/getuser`).pipe(
      tap({
        next: (user) => this.userSignal.set(user),
        error: () => this.userSignal.set(null),
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSignal.set(null);
  }
}
