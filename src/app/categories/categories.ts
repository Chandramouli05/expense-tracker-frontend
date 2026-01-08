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
  isSidebarOpen = signal(false);
  categoryForm!: FormGroup;
  isCategoryModalOpen = false;
  activities = [
    {
      name: 'Home Electricity Bill',
      status: 'Successful',
      date: '27 / 10 / 2025',
      amount: '₹450',
      statusColor: 'text-emerald-500',
    },
    {
      name: 'Festival Shopping',
      status: 'Pending',
      date: '27 / 10 / 2025',
      amount: '₹450',
      statusColor: 'text-yellow-500',
    },
    {
      name: 'Car Services',
      status: 'Successful',
      date: '27 / 10 / 2025',
      amount: '₹450',
      statusColor: 'text-emerald-500',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      date: ['',[Validators.required]],
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
    console.log(this.categoryForm.value)
    this.categoryService.postCategories(this.categoryForm.value).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.closeCategoryModal();
      },
      error: (err) => console.error(err),
    });
  }

  deleteCategory(id:string){
    if(!confirm('Are you sure?')) return;
    this.categoryService.deleteCategories(id).subscribe();
    
  }
  openCategoryModal() {
    this.isCategoryModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCategoryModal() {
    this.isCategoryModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}
