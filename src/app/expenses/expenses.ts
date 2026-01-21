import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expenses-service';
import { CategoryService } from '../services/category-service';
import { ExpenseModal } from '../models/expense.model';

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

  expenses = this.expService.expenses;
  category = this.catService.category;

  ngOnInit() {
    this.expService.getExpenses().subscribe();
    this.catService.getCategories().subscribe();
    this.updateExpense();
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
        this.expenseForm.reset();
        this.closeExpenseModal();
      },
      error: (err) => console.error(err),
    });
  }

  updateExpense() {
    this.expService.updateExpenses(this.selectedExpenseId, this.expenseForm.value).subscribe({
      next: () => {
        this.expenseForm.reset();
        this.closeExpenseModal();
      },
      error: (err) => {
        console.error(err);
      },
    });
   
  }

  deleteExpenses(id: string) {
    if (!confirm('Are you sure want to delete this expenses?')) return;
    this.expService.deleteExpenses(id).subscribe();
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
