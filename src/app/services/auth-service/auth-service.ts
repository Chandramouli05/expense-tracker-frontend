import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiLink = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  signup(data: User) {
    return this.http.post(`${this.apiLink}/signup`, data);
  }

  login(data: User) {
    return this.http.post(`${this.apiLink}/login`, data);
  }

  getUser() {
    return this.http.get<User>(`${this.apiLink}/getuser`);
  }
}
