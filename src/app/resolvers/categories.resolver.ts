import { Injectable } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { Resolve } from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesResolver implements Resolve<boolean> {
  constructor(private categoriesService: CategoryService) {}

  resolve() {
    return forkJoin([this.categoriesService.getCategories()]).pipe(map(() => true));
  }
}
