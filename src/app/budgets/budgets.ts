import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { CategoryService } from '../services/category-service';
import { EMIService } from '../services/emi-service';
import { ExpenseService } from '../services/expenses-service';

interface IncomeItem {
  title: string;
  type: string;
  amount: number;
  date: string;
}

interface SavingsItem {
  title: string;
  type: string;
  amount: number;
  date: string;
}

@Component({
  selector: 'app-budgets',
  imports: [Header, SideNavigation, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './budgets.html',
  styleUrl: './budgets.scss',
})
export class Budgets implements OnInit {

  manageForm!: FormGroup;

  isCategoryModalOpen = false;
  isExpenseModalOpen = false;
  isManageModalOpen = false;
  activeTab: 'income' | 'savings' = 'income';

  // Income and Savings Lists
  incomeList: IncomeItem[] = [];
  savingsList: SavingsItem[] = [];
  

  constructor(private fb: FormBuilder) {

    this.manageForm = this.fb.group({
      incomeTitle: [''],
      incomeType: [''],
      incomeAmount: [0],
      incomeDate: [''],
      savingsTitle: [''],
      savingsType: [''],
      savingsAmount: [0],
      savingsDate: [''],
    });
  }

  private categoryService = inject(CategoryService);
  private emiService = inject(EMIService);
  private expenseService = inject(ExpenseService);

  categories = this.categoryService.category;
  emiList = this.emiService.emi;
  expense = this.expenseService.expenses;

  dashboardExp = computed(() => this.expense().slice(0, 4));

  ngOnInit() {
    this.categoryService.getCategories().subscribe();
    this.emiService.getEMI().subscribe();
    this.expenseService.getExpenses().subscribe();
  }



  handleManageSubmit() {
    const formValue = this.manageForm.value;

    // Add income if form is filled
    if (formValue.incomeTitle && formValue.incomeType && formValue.incomeAmount && formValue.incomeDate) {
      this.incomeList.unshift({
        title: formValue.incomeTitle,
        type: formValue.incomeType,
        amount: formValue.incomeAmount,
        date: formValue.incomeDate
      });
    }

    // Add savings if form is filled
    if (formValue.savingsTitle && formValue.savingsType && formValue.savingsAmount && formValue.savingsDate) {
      this.savingsList.unshift({
        title: formValue.savingsTitle,
        type: formValue.savingsType,
        amount: formValue.savingsAmount,
        date: formValue.savingsDate
      });
    }

    // Close modal and reset form
    this.closeManageModal();
    this.manageForm.reset();

    // Optional: You can add a success notification here
    console.log('Budget updated successfully!');
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

  openManageModal() {
    this.isManageModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeManageModal() {
    this.isManageModalOpen = false;
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