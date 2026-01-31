import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expenses-service';
import { CategoryService } from '../services/category-service';
import { ExpenseModal } from '../models/expense.model';
import { NotificationService } from '../services/notification-service';

@Component({
  selector: 'app-expenses',
  imports: [RouterLink, SideNavigation, Header, CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses implements OnInit {
  expenseForm!: FormGroup;
  selectedExpenseId!: string;

  isSidebarOpen = signal(false);
  isEditModalOpen = false;
  isExpenseModalOpen = false;

  constructor(
    private route: Router,
    private fb: FormBuilder,
  ) {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      status: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  private expService = inject(ExpenseService);
  private catService = inject(CategoryService);
  private notificationService = inject(NotificationService);

  expenses = this.expService.expenses;
  category = this.catService.category;

  currentPage = signal(1);
  pageSize = 5;

  selectedMonth = signal<string>('all');

  filteredExpenses = computed(() => {
    const month = this.selectedMonth();
    if (month === 'all') {
      return this.expenses();
    }

    return this.expenses().filter((exp) => {
      const expMonth = new Date(exp.date).getMonth() + 1;
      return expMonth === Number(month);
    });
  });

  paginatedExpenses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredExpenses().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredExpenses().length / this.pageSize));

  ngOnInit() {
    this.updateExpense();
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

  openExpenseModal() {
    this.isExpenseModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeExpenseModal() {
    this.expenseForm.reset();
    this.isExpenseModalOpen = false;
    this.isEditModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  addExpenses() {
    if (this.expenseForm.invalid) return;

    this.expService.createExpenses(this.expenseForm.value).subscribe({
      next: () => {
        this.notificationService.add('Expense added successfully 💸');
        this.expenseForm.reset();
        this.closeExpenseModal();
      },
      error: (err) => {
        this.notificationService.add('Failed to add expense ❌ ');
        console.error(err);
      },
    });
  }

  updateExpense() {
    if (!this.selectedExpenseId) {
      console.error('Expense ID is missing');
      return;
    }
    this.expService.updateExpenses(this.selectedExpenseId, this.expenseForm.value).subscribe({
      next: () => {
        this.notificationService.add('Expense updated successfully 💸');
        this.expenseForm.reset();
        this.closeExpenseModal();
      },
      error: (err) => {
        this.notificationService.add('Failed to update expense ❌ ');
        console.error(err);
      },
    });
  }

  deleteExpenses(id: string) {
    if (!confirm('Are you sure want to delete this expenses?')) return;
    this.expService.deleteExpenses(id).subscribe({
      next: () => {
        this.notificationService.add('Expense deleted 🗑️');
      },
      error: () => {
        this.notificationService.add('Failed to delete expense ❌');
      },
    });
  }

  openEditModal(exp: ExpenseModal) {
    this.selectedExpenseId = exp._id;
    this.isEditModalOpen = true;

    this.expenseForm.patchValue({
      title: exp.title,
      category: exp.category,
      status: exp.status,
      date: exp.date,
      amount: exp.amount,
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
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

  logout() {
    if (confirm('Do you want to logout?')) {
      localStorage.removeItem('token');
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }
}
