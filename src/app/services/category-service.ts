import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/categories.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiLink = environment.apiUrl + '/categories';
  private categoriesSignal = signal<Category[]>([]);
  readonly category = this.categoriesSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Category[]>(`${this.apiLink}`).pipe(
      tap({
        next: (categories) => this.categoriesSignal.set(categories),
        error: (err) => this.categoriesSignal.set(err),
      })
    );
  }

  postCategories(category: Category) {
    return this.http.post<{ name: string; icon: string }>(`${this.apiLink}`, category).pipe(
      tap((newCategory) => {
        this.categoriesSignal.update((prev) => [...prev, newCategory]);
      })
    );
  }
}
