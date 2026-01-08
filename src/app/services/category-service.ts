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
    return this.http.post<Category>(`${this.apiLink}`, category).pipe(
      tap((newCategory) => {
        this.categoriesSignal.update((prev) => [...prev, newCategory]);
      })
    );
  }

  deleteCategories(_id: string) {
    return this.http.delete<{ message: string; _id: string }>(`${this.apiLink}/${_id}`).pipe(
      tap(() => {
        this.categoriesSignal.update((prev) => prev.filter((cat) => cat._id !== _id));
      })
    );
  }
}
