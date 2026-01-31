import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/categories.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification-service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, SideNavigation, Header, ReactiveFormsModule],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  categoryForm!: FormGroup;

  selectedCategoryId!: string;

  isSidebarOpen = signal(false);
  isEditModalOpen = false;
  isCategoryModalOpen = false;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      date: ['', [Validators.required]],
      name: ['', [Validators.required]],
      icon: ['', [Validators.required]],
    });
  }

  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);

  categories = this.categoryService.category;

  currentPage = signal(1);
  pageSize = 5;

  selectedMonth = signal<string>('all');

  filteredCategories = computed(() => {
    const month = this.selectedMonth();
    if (month === 'all') {
      return this.categories();
    }

    return this.categories().filter((cat) => {
      const cateMonth = new Date(cat.date).getMonth() + 1;
      return cateMonth === Number(month);
    });
  });

  paginatedCategories = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredCategories().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredCategories().length / this.pageSize));

  ngOnInit() {
    this.updateCategory();
  }

  onMonthChange(value: string) {
    this.selectedMonth.set(value);
    this.currentPage.set(1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }
  goToPage(page: number) {
    this.currentPage.set(page);
  }

  addCategory() {
    if (this.categoryForm.invalid) return;

    this.categoryService.postCategories(this.categoryForm.value).subscribe({
      next: () => {
        this.notificationService.add('Category added successfully 💸');
        this.categoryForm.reset();
        this.closeCategoryModal();
      },
      error: (err) => {
        this.notificationService.add('Failed to add category ❌');
        console.error(err);
      },
    });
  }

  deleteCategory(id: string) {
    if (!confirm('Are you sure?')) return;
    this.categoryService.deleteCategories(id).subscribe({
      next: () => {
        this.notificationService.add('Category deleted 🗑️');
      },
      error: () => {
        this.notificationService.add('Failed to delete category ❌');
      },
    });
  }

  openCategoryModal() {
    this.isCategoryModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCategoryModal() {
    this.categoryForm.reset();
    this.isCategoryModalOpen = false;
    this.isEditModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  openEditModal(category: Category) {
    this.selectedCategoryId = category._id;
    this.isEditModalOpen = true;

    this.categoryForm.patchValue({
      name: category.name,
      icon: category.icon,
      date: category.date,
    });

    document.body.style.overflow = 'hidden';
  }

  updateCategory() {
    this.categoryService
      .updateCategories(this.selectedCategoryId, this.categoryForm.value)
      .subscribe({
        next: () => {
          this.notificationService.add('Category updated successfully 💸');
          this.categoryForm.reset();
          this.closeCategoryModal();
        },
        error: (err) => {
          this.notificationService.add('Failed to update category ❌ ');
          console.error(err);
        },
      });

    this.categoryService.getCategories().subscribe();
  }
}
