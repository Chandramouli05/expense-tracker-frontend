import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  AfterViewInit
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { EMI } from '../models/emi.model';
import { EMIService } from '../services/emi-service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ExpenseCategory } from '../expense-category/expense-category';
import { SpendingTrend } from '../spending-trend/spending-trend';
import { SavingsAverage } from '../savings-average/savings-average';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SideNavigation,
    Header,
    ReactiveFormsModule,
    ExpenseCategory,
    SpendingTrend,
    SavingsAverage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements AfterViewInit {
  emiForm!: FormGroup;
  selectedEMIid!: string;

  isSidebarOpen = signal(false);
  isEMIModalOpen = false;
  isEditModalOpen = false;

  // ⛔ start false — render charts only after view init
  isExpenseDataLoad = false;
  isSpendingTrendLoad = false;
  isSavingsAverageLoad = false;

  private emiService = inject(EMIService);

  emiList = this.emiService.emi;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.emiForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  // 🔑 KEY FIX
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isExpenseDataLoad = true;
      this.isSpendingTrendLoad = true;
      this.isSavingsAverageLoad = true;

      // Force chart libraries to recalc layout
      window.dispatchEvent(new Event('resize'));

      // Notify Angular (OnPush)
      this.cdr.markForCheck();
    });
  }

  openEMIModal() {
    this.isEMIModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeEMIModal() {
    this.isEMIModalOpen = false;
    this.isEditModalOpen = false;
    this.selectedEMIid = '';
    this.emiForm.reset();
    document.body.style.overflow = 'auto';
  }

  openEditModal(emi: EMI) {
    this.selectedEMIid = emi._id;
    this.isEMIModalOpen = false;
    this.isEditModalOpen = true;

    this.emiForm.patchValue({
      name: emi.name,
      date: emi.date,
      amount: emi.amount
    });

    document.body.style.overflow = 'hidden';
  }

  updateEMI() {
    if (!this.selectedEMIid || this.emiForm.invalid) return;

    this.emiService.updateEMI(this.selectedEMIid, this.emiForm.value).subscribe({
      next: () => this.closeEMIModal(),
      error: err => console.error(err)
    });
  }

  addEMI() {
    if (this.emiForm.invalid) return;

    this.emiService.createEMI(this.emiForm.value).subscribe({
      next: () => this.closeEMIModal(),
      error: err => console.error(err)
    });
  }

  deleteEMI(id: string) {
    if (!confirm('Are you sure?')) return;
    this.emiService.deleteEMI(id).subscribe();
  }

  getEMIstatus(date: string | Date) {
    const today = new Date();
    const emiDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    emiDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (emiDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

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
