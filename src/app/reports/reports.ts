import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  AfterViewInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';
import { EMIService } from '../services/emi-service';
import { EMI } from '../models/emi.model';

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
    SavingsAverage,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reports implements AfterViewInit {
  /* ---------------- FORMS ---------------- */
  emiForm!: FormGroup;
  reportForm!: FormGroup;

  /* ---------------- STATE ---------------- */
  selectedEMIid!: string;

  isSidebarOpen = signal(false);
  isEMIModalOpen = false;
  isEditModalOpen = false;

  isExpenseDataLoad = false;
  isSpendingTrendLoad = false;
  isSavingsAverageLoad = false;

  isDownloading = false;

  /* ---------------- SERVICES ---------------- */
  private emiService = inject(EMIService);

  emiList = this.emiService.emi;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    /* EMI FORM */
    this.emiForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      amount: ['', Validators.required],
    });

    /* REPORT FORM */
    this.reportForm = this.fb.group({
      type: ['all', Validators.required],
      month: ['all', Validators.required],
      format: ['', Validators.required],
    });
  }

  /* ---------------- LIFECYCLE ---------------- */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isExpenseDataLoad = true;
      this.isSpendingTrendLoad = true;
      this.isSavingsAverageLoad = true;

      window.dispatchEvent(new Event('resize'));
      this.cdr.markForCheck();
    });
  }

  /* ---------------- EMI MODALS ---------------- */
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
    this.isEditModalOpen = true;
    this.isEMIModalOpen = false;

    this.emiForm.patchValue({
      name: emi.name,
      date: emi.date,
      amount: emi.amount,
    });

    document.body.style.overflow = 'hidden';
  }

  /* ---------------- EMI CRUD ---------------- */
  addEMI() {
    if (this.emiForm.invalid) return;

    this.emiService.createEMI(this.emiForm.value).subscribe({
      next: () => this.closeEMIModal(),
      error: (err) => console.error(err),
    });
  }

  updateEMI() {
    if (!this.selectedEMIid || this.emiForm.invalid) return;

    this.emiService.updateEMI(this.selectedEMIid, this.emiForm.value).subscribe({
      next: () => this.closeEMIModal(),
      error: (err) => console.error(err),
    });
  }

  deleteEMI(id: string) {
    if (!confirm('Are you sure?')) return;
    this.emiService.deleteEMI(id).subscribe();
  }

  /* ---------------- EMI STATUS ---------------- */
  getEMIstatus(date: string | Date) {
    const today = new Date();
    const emiDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    emiDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (emiDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return { text: 'OverDue', class: 'bg-red-100 text-red-700' };
    if (diffDays <= 5) return { text: 'Due Soon', class: 'bg-yellow-100 text-yellow-700' };
    if (diffDays <= 25) return { text: 'Upcoming', class: 'bg-green-100 text-green-700' };

    return null;
  }

  /* ---------------- REPORT DOWNLOAD ---------------- */
  downloadReport() {
    if (this.reportForm.invalid || this.isDownloading) return;

    this.isDownloading = true;
    const { type, month, format } = this.reportForm.value;

    this.emiService.downloadReport({ type, month, format }).subscribe({
      next: (response) => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('content-disposition');

        let fileName = `report.${format}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+)"?/);
          if (match?.[1]) fileName = match[1];
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.isDownloading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
