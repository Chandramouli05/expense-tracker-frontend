import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Header } from '../header/header';
import { SideNavigation } from '../side-navigation/side-navigation';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMIService } from '../services/emi-service';

@Component({
  selector: 'app-dashboard',
  imports: [Header, SideNavigation, CommonModule, RouterLink, ReactiveFormsModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  categoryForm!: FormGroup;

  isCategoryModalOpen = false;
  isExpenseModalOpen = false;

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
  private emiService = inject(EMIService);

  categories = this.categoryService.category;
  emiList = this.emiService.emi;

  ngOnInit() {
    this.categoryService.getCategories().subscribe();
    this.emiService.getEMI().subscribe();
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

  getEMIstatus(date: string | Date) {
    const today = new Date();
    const emiDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    emiDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((emiDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'OverDue', class: 'bg-red-100 text-red-700' };
    }
    if (diffDays <= 5) {
      return { text: 'Due Soon', class: 'bg-yellow-100 text-yellow-700' };
    }

    if (diffDays <= 25) {
      return { text: 'Upcoming', class: 'bg-green-100 text-green-700' };
    }

    return null;
  }
}
