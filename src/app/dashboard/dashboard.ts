import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Header } from '../header/header';
import { SideNavigation } from '../side-navigation/side-navigation';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/categories.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [Header, SideNavigation, CommonModule, RouterLink, ReactiveFormsModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  categoryForm!: FormGroup;

  isCategoryModalOpen = false;
  isExpenseModalOpen = false;

  emiReminders = [
    {
      name: 'ICICI personal loan EMI',
      date: '5th Jan 2026',
      amount: '₹12,500',
      status: 'Upcoming',
      statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      name: 'BIKE loan EMI',
      date: '27th Dec 2025',
      amount: '₹10,500',
      status: 'Due Soon',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      name: 'Credit Card EMI',
      date: '22nd Dec 2025',
      amount: '₹5000',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-700',
    },
    {
      name: 'Phone EMI',
      date: '27th Dec 2025',
      amount: '₹2,500',
      status: 'Due Soon',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
  ];

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
    this.categoryService.postCategories(this.categoryForm.value).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.closeCategoryModal();
      },
      error: (err) => console.error(err),
    });
  }

  openCategoryModal() {
    this.isCategoryModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCategoryModal() {
    this.isCategoryModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  openExpenseModal() {
    this.isExpenseModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeExpenseModal() {
    this.isExpenseModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}
