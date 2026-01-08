import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/categories.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink, SideNavigation, Header, ReactiveFormsModule],
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

  categories = this.categoryService.category;

  ngOnInit() {
    this.categoryService.getCategories().subscribe();
  }

  addCategory() {
    if (this.categoryForm.invalid) return;

    this.categoryService.postCategories(this.categoryForm.value).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.closeCategoryModal();
      },
      error: (err) => console.error(err),
    });
  }

  deleteCategory(id: string) {
    if (!confirm('Are you sure?')) return;
    this.categoryService.deleteCategories(id).subscribe();
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
          this.categoryForm.reset();
          this.closeCategoryModal();
        },
        error: (err) => console.error(err),
      });

    this.categoryService.getCategories().subscribe();
  }
}
