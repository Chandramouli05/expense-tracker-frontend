import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { CategoryService } from '../services/category-service';
import { EMIService } from '../services/emi-service';
import { ExpenseService } from '../services/expenses-service';
import { IncomeService } from '../services/income-service';
import { SavingsService } from '../services/savings-service';
import { Income } from '../models/income.model';
import { Savings } from '../models/savings.model';

@Component({
  selector: 'app-budgets',
  imports: [Header, SideNavigation, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './budgets.html',
  styleUrl: './budgets.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Budgets implements OnInit {
  manageForm!: FormGroup;

  isCategoryModalOpen = false;
  isExpenseModalOpen = false;
  isManageModalOpen = false;

  activeTab: 'income' | 'savings' = 'income';

  constructor(private fb: FormBuilder) {
    this.manageForm = this.fb.group({
      incomeTitle: [''],
      incomeType: [''],
      incomeAmount: [''],
      incomeDate: [''],
      savingsTitle: [''],
      savingsType: [''],
      savingsAmount: [''],
      savingsDate: [''],
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
  incomeList = this.incomeServices.income;
  savingList = this.savingServices.savings;

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

  totalBalanceAmount =
    this.totalIncomeAmount() - this.totalExpenseAmount() - this.totalSavingAmount();

  ngOnInit() {
    this.incomeList();
    this.savingList();
  }

  handleManageSubmit() {
    const formValue = this.manageForm.value;

    // Add income if form is filled
    if (
      formValue.incomeTitle &&
      formValue.incomeType &&
      formValue.incomeAmount &&
      formValue.incomeDate
    ) {
      const newIncome: Income = {
        title: formValue.incomeTitle,
        type: formValue.incomeType,
        amount: formValue.incomeAmount,
        date: formValue.incomeDate,
      } as Income;

      this.incomeServices.createIncome(newIncome).subscribe();

      console.log('Income added:', newIncome);
      console.log('Total Income:', this.totalIncomeAmount());
    }

    // Add savings if form is filled
    if (
      formValue.savingsTitle &&
      formValue.savingsType &&
      formValue.savingsAmount &&
      formValue.savingsDate
    ) {
      const newSavings: Savings = {
        title: formValue.savingsTitle,
        type: formValue.savingsType,
        amount: formValue.savingsAmount,
        date: formValue.savingsDate,
      } as Savings;

      // ✅ CORRECT: Update the signal, not the getter
      this.savingServices.createSavings(newSavings).subscribe();
    }

    // Close modal and reset form
    this.closeManageModal();
    this.manageForm.reset();

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

  openEditModal(_id: string) {}


  deleteIncome(_id: string) {
    this.incomeServices.deleteIncome(_id).subscribe();
  }

  deleteSavings(_id: string) {
    this.savingServices.deleteSavings(_id).subscribe();
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
