import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Header } from '../header/header';
import { SideNavigation } from '../side-navigation/side-navigation';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMIService } from '../services/emi-service';
import { ExpenseService } from '../services/expenses-service';
import { IncomeService } from '../services/income-service';
import { SavingsService } from '../services/savings-service';
import { ExpenseCategory } from '../expense-category/expense-category';
import { SpendingTrend } from '../spending-trend/spending-trend';

@Component({
  selector: 'app-dashboard',
  imports: [Header, SideNavigation, CommonModule, RouterLink, ReactiveFormsModule, ExpenseCategory, SpendingTrend],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  categoryForm!: FormGroup;

  isCategoryModalOpen = false;
  isExpenseModalOpen = false;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      icon: ['', [Validators.required]],
    });
  }

  private categoryService = inject(CategoryService);
  private emiService = inject(EMIService);
  private expenseService = inject(ExpenseService);
  private incomeServices = inject(IncomeService);
  private savingServices = inject(SavingsService);

  categories = this.categoryService.category;
  emiList = this.emiService.emi;
  expense = this.expenseService.expenses;

  dashboardExp = computed(() => this.expense().slice(0, 4));

  totalExpenseAmount = computed(() =>
    this.expenseService.expenses().reduce((total, item) => total + Number(item.amount), 0),
  );

  totalIncomeAmount = computed(() =>
    this.incomeServices.income().reduce((total, item) => total + Number(item.amount), 0),
  );

  totalSavingAmount = computed(() =>
    this.savingServices.savings().reduce((total, item) => total + Number(item.amount), 0),
  );

  totalBalanceAmount = computed(
    () => this.totalIncomeAmount() - this.totalExpenseAmount() - this.totalSavingAmount(),
  );

  ngOnInit() {}

  addCategory() {
    this.categoryService.postCategories(this.categoryForm.value).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.closeCategoryModal();
      },
      error: (err) => console.error(err),
    });
  }

  changeStatusColor(status: string) {
    if (status === 'Successful') {
      return 'text-green-500';
    }
    if (status === 'Pending') {
      return 'text-yellow-500';
    }
    if (status === 'Failed') {
      return 'text-red-600';
    }
    return '';
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
